import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { verify } from "hono/jwt";
import prisma from "@LockedIn/db";
import { env } from "@LockedIn/env/server";

type Variables = {
  userId: string;
};

const goals = new Hono<{ Variables: Variables }>();

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

// Get all goals for user
goals.get("/", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const userGoals = await prisma.goal.findMany({
    where: { userId },
    include: {
      updates: {
        orderBy: { createdAt: "desc" },
      },
      group: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return c.json({ success: true, goals: userGoals });
});

// Get single goal
goals.get("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const goalId = c.req.param("id");

  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    include: {
      updates: {
        orderBy: { createdAt: "desc" },
      },
      group: {
        select: { id: true, name: true },
      },
    },
  });

  if (!goal) {
    return c.json({ success: false, message: "Goal not found" }, 404);
  }

  return c.json({ success: true, goal });
});

// Create goal
goals.post(
  "/",
  authMiddleware,
  zValidator(
    "json",
    z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      targetValue: z.number().positive(),
      unit: z.string(),
      category: z.string().optional(),
      endDate: z.string().transform((s) => new Date(s)),
      groupId: z.string().optional(),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const goal = await prisma.goal.create({
      data: {
        ...data,
        userId,
      },
      include: {
        updates: true,
      },
    });

    return c.json({ success: true, goal }, 201);
  }
);

// Update goal
goals.patch(
  "/:id",
  authMiddleware,
  zValidator(
    "json",
    z.object({
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      targetValue: z.number().positive().optional(),
      unit: z.string().optional(),
      category: z.string().optional(),
      endDate: z.string().transform((s) => new Date(s)).optional(),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const goalId = c.req.param("id");
    const data = c.req.valid("json");

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      return c.json({ success: false, message: "Goal not found" }, 404);
    }

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data,
      include: { updates: true },
    });

    return c.json({ success: true, goal: updatedGoal });
  }
);

// Delete goal
goals.delete("/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const goalId = c.req.param("id");

  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
  });

  if (!goal) {
    return c.json({ success: false, message: "Goal not found" }, 404);
  }

  await prisma.goal.delete({ where: { id: goalId } });

  return c.json({ success: true, message: "Goal deleted" });
});

// Add goal update (log progress)
goals.post(
  "/:id/updates",
  authMiddleware,
  zValidator(
    "json",
    z.object({
      amount: z.number().positive(),
      note: z.string().optional(),
      proofUrl: z.string().url().optional(),
      proofType: z.enum(["image", "document"]).optional(),
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const goalId = c.req.param("id");
    const data = c.req.valid("json");

    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      return c.json({ success: false, message: "Goal not found" }, 404);
    }

    // Create the update
    const update = await prisma.goalUpdate.create({
      data: {
        ...data,
        goalId,
        userId,
      },
    });

    // Update goal progress
    const newCurrentValue = goal.currentValue + data.amount;
    const isCompleted = newCurrentValue >= goal.targetValue;
    const isSurpassed = newCurrentValue > goal.targetValue;

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentValue: newCurrentValue,
        isCompleted,
        isSurpassed,
        completedAt: isCompleted && !goal.completedAt ? new Date() : goal.completedAt,
      },
      include: { updates: true },
    });

    // Create notification if goal completed/surpassed
    if (isCompleted && !goal.isCompleted) {
      await prisma.notification.create({
        data: {
          userId,
          title: isSurpassed ? "🎉 Goal Surpassed!" : "✅ Goal Completed!",
          body: isSurpassed
            ? `Amazing! You've exceeded your goal: "${goal.title}"!`
            : `Congratulations! You've completed: "${goal.title}"!`,
          type: isSurpassed ? "goal_surpassed" : "goal_completed",
          data: { goalId },
        },
      });
    }

    return c.json({ success: true, update, goal: updatedGoal }, 201);
  }
);

export default goals;
