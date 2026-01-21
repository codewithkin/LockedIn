import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { verify } from "hono/jwt";
import prisma from "@LockedIn/db";
import { env } from "@LockedIn/env/server";
import { createNotification } from "../lib/notifications";

type Variables = {
  userId: string;
};

const gang = new Hono<{ Variables: Variables }>();

// Middleware to verify auth
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verify(token, env.JWT_SECRET, "HS256");
    c.set("userId", payload.userId as string);
    await next();
  } catch (error) {
    return c.json({ success: false, message: "Invalid or expired token" }, 401);
  }
};

// Get all gang members (mutual connections)
gang.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");

  // Get all mutual connections where user is either userA or userB
  const gangConnections = await prisma.gang.findMany({
    where: {
      OR: [
        { userAId: userId },
        { userBId: userId },
      ],
    },
    include: {
      userA: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
      userB: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
  });

  // Map to get the other person in each connection
  const members = gangConnections.map((connection) => {
    const otherUser = connection.userAId === userId ? connection.userB : connection.userA;
    return {
      id: otherUser.id,
      name: otherUser.name,
      email: otherUser.email,
      avatarUrl: otherUser.avatarUrl,
      mutualSince: connection.createdAt,
    };
  });

  return c.json({ success: true, members });
});

// Get pending gang requests (received)
gang.get("/requests", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const requests = await prisma.gangRequest.findMany({
    where: {
      receiverId: userId,
      status: "pending",
    },
    include: {
      sender: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ success: true, requests });
});

// Get sent gang requests
gang.get("/requests/sent", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const requests = await prisma.gangRequest.findMany({
    where: {
      senderId: userId,
      status: "pending",
    },
    include: {
      receiver: {
        select: { id: true, name: true, email: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ success: true, requests });
});

// Send gang request
gang.post(
  "/request",
  authMiddleware,
  zValidator(
    "json",
    z.object({
      toUserId: z.string(),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const { toUserId } = c.req.valid("json");

    // Can't send request to yourself
    if (userId === toUserId) {
      return c.json({ success: false, message: "Cannot send request to yourself" }, 400);
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: toUserId },
    });

    if (!targetUser) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    // Check if already gang members
    const existingGang = await prisma.gang.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: toUserId },
          { userAId: toUserId, userBId: userId },
        ],
      },
    });

    if (existingGang) {
      return c.json({ success: false, message: "Already in gang" }, 400);
    }

    // Check if request already exists
    const existingRequest = await prisma.gangRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: toUserId, status: "pending" },
          { senderId: toUserId, receiverId: userId, status: "pending" },
        ],
      },
    });

    if (existingRequest) {
      // If there's an incoming request from this person, auto-accept
      if (existingRequest.senderId === toUserId) {
        // Create gang connection
        await prisma.gang.create({
          data: {
            userAId: userId,
            userBId: toUserId,
          },
        });

        // Update request status
        await prisma.gangRequest.update({
          where: { id: existingRequest.id },
          data: { status: "accepted" },
        });

        return c.json({
          success: true,
          message: "Gang connection established!",
          autoAccepted: true,
        });
      }

      return c.json({ success: false, message: "Request already pending" }, 400);
    }

    // Create new request
    const request = await prisma.gangRequest.create({
      data: {
        senderId: userId,
        receiverId: toUserId,
      },
    });

    // Get sender info for notification
    const sender = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    // Create notification for receiver
    await createNotification({
      userId: toUserId,
      title: "New Gang Request",
      body: `${sender?.name || sender?.email || "Someone"} wants to join your gang`,
      type: "gang_request",
      data: { requestId: request.id, senderId: userId },
    });

    return c.json({ success: true, request });
  }
);

// Accept gang request
gang.post(
  "/request/:requestId/accept",
  authMiddleware,
  async (c) => {
    const userId = c.get("userId");
    const requestId = c.req.param("requestId");

    const request = await prisma.gangRequest.findFirst({
      where: {
        id: requestId,
        receiverId: userId,
        status: "pending",
      },
    });

    if (!request) {
      return c.json({ success: false, message: "Request not found" }, 404);
    }

    // Create gang connection
    await prisma.gang.create({
      data: {
        userAId: request.senderId,
        userBId: userId,
      },
    });

    // Update request status
    await prisma.gangRequest.update({
      where: { id: requestId },
      data: { status: "accepted" },
    });

    // Get accepter info for notification
    const accepter = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    // Notify sender that request was accepted
    await createNotification({
      userId: request.senderId,
      title: "Gang Request Accepted",
      body: `${accepter?.name || accepter?.email || "Someone"} accepted your gang request`,
      type: "gang_accepted",
      data: { userId },
    });

    return c.json({ success: true, message: "Gang connection established!" });
  }
);

// Decline gang request
gang.post(
  "/request/:requestId/decline",
  authMiddleware,
  async (c) => {
    const userId = c.get("userId");
    const requestId = c.req.param("requestId");

    const request = await prisma.gangRequest.findFirst({
      where: {
        id: requestId,
        receiverId: userId,
        status: "pending",
      },
    });

    if (!request) {
      return c.json({ success: false, message: "Request not found" }, 404);
    }

    await prisma.gangRequest.update({
      where: { id: requestId },
      data: { status: "declined" },
    });

    return c.json({ success: true, message: "Request declined" });
  }
);

// Cancel sent request
gang.delete(
  "/request/:requestId",
  authMiddleware,
  async (c) => {
    const userId = c.get("userId");
    const requestId = c.req.param("requestId");

    const request = await prisma.gangRequest.findFirst({
      where: {
        id: requestId,
        senderId: userId,
        status: "pending",
      },
    });

    if (!request) {
      return c.json({ success: false, message: "Request not found" }, 404);
    }

    await prisma.gangRequest.delete({
      where: { id: requestId },
    });

    return c.json({ success: true, message: "Request cancelled" });
  }
);

// Remove gang member
gang.delete(
  "/member/:memberId",
  authMiddleware,
  async (c) => {
    const userId = c.get("userId");
    const memberId = c.req.param("memberId");

    const gangConnection = await prisma.gang.findFirst({
      where: {
        OR: [
          { userAId: userId, userBId: memberId },
          { userAId: memberId, userBId: userId },
        ],
      },
    });

    if (!gangConnection) {
      return c.json({ success: false, message: "Gang connection not found" }, 404);
    }

    await prisma.gang.delete({
      where: { id: gangConnection.id },
    });

    return c.json({ success: true, message: "Removed from gang" });
  }
);

// Get gang count for a user
gang.get("/count/:userId?", authMiddleware, async (c) => {
  const requestingUserId = c.get("userId");
  const targetUserId = c.req.param("userId") || requestingUserId;

  const count = await prisma.gang.count({
    where: {
      OR: [
        { userAId: targetUserId },
        { userBId: targetUserId },
      ],
    },
  });

  return c.json({ success: true, count });
});

export default gang;
