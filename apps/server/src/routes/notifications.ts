import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import prisma from "@LockedIn/db";
import { verify } from "hono/jwt";
import { env } from "@LockedIn/env/server";

type Variables = {
  userId: string;
};

const notifications = new Hono<{ Variables: Variables }>();

// Middleware to verify JWT token and extract userId
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
    return c.json({ success: false, message: "Invalid token" }, 401);
  }
};

// Get all notifications for the user
notifications.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");

  try {
    const userNotifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return c.json({
      success: true,
      notifications: userNotifications,
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return c.json({ success: false, message: "Failed to fetch notifications" }, 500);
  }
});

// Get unread count
notifications.get("/unread-count", authMiddleware, async (c) => {
  const userId = c.get("userId");

  try {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return c.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Failed to get unread count:", error);
    return c.json({ success: false, message: "Failed to get unread count" }, 500);
  }
});

// Mark notification as read
notifications.patch(
  "/:id/read",
  authMiddleware,
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const { id } = c.req.valid("param");

    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        return c.json({ success: false, message: "Notification not found" }, 404);
      }

      if (notification.userId !== userId) {
        return c.json({ success: false, message: "Unauthorized" }, 403);
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });

      return c.json({
        success: true,
        notification: updated,
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return c.json({ success: false, message: "Failed to update notification" }, 500);
    }
  }
);

// Mark all notifications as read
notifications.patch("/read-all", authMiddleware, async (c) => {
  const userId = c.get("userId");

  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    return c.json({ success: false, message: "Failed to update notifications" }, 500);
  }
});

// Delete notification
notifications.delete(
  "/:id",
  authMiddleware,
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const { id } = c.req.valid("param");

    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        return c.json({ success: false, message: "Notification not found" }, 404);
      }

      if (notification.userId !== userId) {
        return c.json({ success: false, message: "Unauthorized" }, 403);
      }

      await prisma.notification.delete({
        where: { id },
      });

      return c.json({ success: true });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      return c.json({ success: false, message: "Failed to delete notification" }, 500);
    }
  }
);

// Delete all notifications
notifications.delete("/", authMiddleware, async (c) => {
  const userId = c.get("userId");

  try {
    await prisma.notification.deleteMany({
      where: { userId },
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Failed to delete all notifications:", error);
    return c.json({ success: false, message: "Failed to delete notifications" }, 500);
  }
});

export default notifications;
