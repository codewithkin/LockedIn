import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { verify } from "hono/jwt";
import prisma from "@LockedIn/db";
import { env } from "@LockedIn/env/server";

type Variables = {
  userId: string;
};

const groups = new Hono<{ Variables: Variables }>();

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

// Get all groups for user
groups.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const userGroups = await prisma.group.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true, email: true },
          },
        },
      },
      _count: {
        select: { goals: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ success: true, groups: userGroups });
});

// Get single group
groups.get("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const groupId = c.req.param("id");

  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      members: { some: { userId } },
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true, email: true },
          },
        },
      },
      goals: {
        include: {
          user: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
      },
    },
  });

  if (!group) {
    return c.json({ success: false, message: "Group not found" }, 404);
  }

  return c.json({ success: true, group });
});

// Create group
groups.post(
  "/",
  authMiddleware,
  zValidator(
    "json",
    z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      isPublic: z.boolean().default(false),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const group = await prisma.group.create({
      data: {
        ...data,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "admin",
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true, email: true },
            },
          },
        },
      },
    });

    return c.json({ success: true, group }, 201);
  }
);

// Join group by invite code
groups.post(
  "/join",
  authMiddleware,
  zValidator(
    "json",
    z.object({
      inviteCode: z.string().min(1),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const { inviteCode } = c.req.valid("json");

    const group = await prisma.group.findUnique({
      where: { inviteCode },
      include: { members: true },
    });

    if (!group) {
      return c.json({ success: false, message: "Group not found" }, 404);
    }

    // Check if already a member
    const existingMember = group.members.find((m: { userId: string }) => m.userId === userId);
    if (existingMember) {
      return c.json({ success: false, message: "Already a member" }, 400);
    }

    // Add member
    await prisma.groupMember.create({
      data: {
        userId,
        groupId: group.id,
        role: "member",
      },
    });

    // Get updated group
    const updatedGroup = await prisma.group.findUnique({
      where: { id: group.id },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true, email: true },
            },
          },
        },
      },
    });

    return c.json({ success: true, group: updatedGroup });
  }
);

// Leave group
groups.delete("/:id/leave", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const groupId = c.req.param("id");

  const group = await prisma.group.findFirst({
    where: { id: groupId },
  });

  if (!group) {
    return c.json({ success: false, message: "Group not found" }, 404);
  }

  // Can't leave if owner
  if (group.ownerId === userId) {
    return c.json(
      { success: false, message: "Owner cannot leave. Transfer ownership first." },
      400
    );
  }

  await prisma.groupMember.deleteMany({
    where: { userId, groupId },
  });

  return c.json({ success: true, message: "Left group" });
});

// Update group
groups.patch(
  "/:id",
  authMiddleware,
  zValidator(
    "json",
    z.object({
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      isPublic: z.boolean().optional(),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const groupId = c.req.param("id");
    const data = c.req.valid("json");

    const group = await prisma.group.findFirst({
      where: { id: groupId, ownerId: userId },
    });

    if (!group) {
      return c.json({ success: false, message: "Group not found or not owner" }, 404);
    }

    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data,
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true, email: true },
            },
          },
        },
      },
    });

    return c.json({ success: true, group: updatedGroup });
  }
);

export default groups;
