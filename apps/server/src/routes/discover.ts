import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { verify } from "hono/jwt";
import prisma from "@LockedIn/db";
import { env } from "@LockedIn/env/server";

type Variables = {
  userId?: string;
};

const discover = new Hono<{ Variables: Variables }>();

// Optional auth middleware - sets userId if authenticated, but doesn't require it
const optionalAuthMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const payload = await verify(token, env.JWT_SECRET, "HS256");
      c.set("userId", payload.userId as string);
    } catch (error) {
      // Token invalid, but continue as guest
    }
  }
  await next();
};

// Get public groups for discovery
discover.get("/groups", optionalAuthMiddleware, async (c) => {
  const userId = c.get("userId");
  const search = c.req.query("search") || "";
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");

  const groups = await prisma.group.findMany({
    where: {
      isPublic: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    select: {
      id: true,
      name: true,
      description: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: { 
          members: true,
          goals: true,
        },
      },
      members: userId ? {
        where: { userId },
        select: { id: true },
      } : false,
    },
    orderBy: [
      { members: { _count: "desc" } },
      { createdAt: "desc" },
    ],
    take: limit,
    skip: offset,
  });

  // Transform to include isMember flag
  const transformedGroups = groups.map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    avatarUrl: g.avatarUrl,
    memberCount: g._count.members,
    goalCount: g._count.goals,
    isMember: userId ? (g.members && g.members.length > 0) : false,
    createdAt: g.createdAt,
  }));

  return c.json({ success: true, groups: transformedGroups });
});

// Get public profiles for discovery
discover.get("/people", optionalAuthMiddleware, async (c) => {
  const userId = c.get("userId");
  const search = c.req.query("search") || "";
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");

  const users = await prisma.user.findMany({
    where: {
      isPublic: true,
      ...(userId && { id: { not: userId } }), // Exclude current user
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      _count: {
        select: { goals: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  // Check follow status if user is authenticated
  let followStatuses: Record<string, boolean> = {};
  if (userId) {
    const gangs = await prisma.gang.findMany({
      where: {
        OR: [
          { userAId: userId, userBId: { in: users.map((u) => u.id) } },
          { userBId: userId, userAId: { in: users.map((u) => u.id) } },
        ],
      },
    });
    
    gangs.forEach((g) => {
      const otherId = g.userAId === userId ? g.userBId : g.userAId;
      followStatuses[otherId] = true;
    });
  }

  const transformedUsers = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatarUrl: u.avatarUrl,
    goalCount: u._count.goals,
    isFollowing: followStatuses[u.id] || false,
    createdAt: u.createdAt,
  }));

  return c.json({ success: true, people: transformedUsers });
});

// Get stats for cockpit (public summary)
discover.get("/stats", optionalAuthMiddleware, async (c) => {
  const userId = c.get("userId");

  // Get platform-wide stats
  const [totalUsers, totalGoals, completedGoals, totalGroups] = await Promise.all([
    prisma.user.count(),
    prisma.goal.count(),
    prisma.goal.count({ where: { isCompleted: true } }),
    prisma.group.count({ where: { isPublic: true } }),
  ]);

  // Get user-specific stats if authenticated
  let userStats = null;
  if (userId) {
    const [userGoals, userGroups, gangMembers] = await Promise.all([
      prisma.goal.findMany({
        where: { userId },
        select: { isCompleted: true, isSurpassed: true, category: true, currentValue: true, targetValue: true },
      }),
      prisma.groupMember.count({ where: { userId } }),
      prisma.gang.count({
        where: { OR: [{ userAId: userId }, { userBId: userId }] },
      }),
    ]);

    const completed = userGoals.filter((g) => g.isCompleted).length;
    const surpassed = userGoals.filter((g) => g.isSurpassed).length;
    const active = userGoals.filter((g) => !g.isCompleted).length;

    // Calculate average progress
    const activeGoals = userGoals.filter((g) => !g.isCompleted);
    const avgProgress = activeGoals.length > 0
      ? activeGoals.reduce((acc, g) => acc + (g.currentValue / g.targetValue) * 100, 0) / activeGoals.length
      : 0;

    // Category breakdown
    const categoryMap = new Map<string, number>();
    userGoals.forEach((g) => {
      const cat = g.category || "other";
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });

    userStats = {
      totalGoals: userGoals.length,
      completedGoals: completed,
      surpassedGoals: surpassed,
      activeGoals: active,
      groupCount: userGroups,
      gangCount: gangMembers,
      avgProgress: Math.round(avgProgress),
      categoryBreakdown: Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
      })),
    };
  }

  return c.json({
    success: true,
    platform: {
      totalUsers,
      totalGoals,
      completedGoals,
      totalPublicGroups: totalGroups,
    },
    user: userStats,
  });
});

// Get top 3 users by completed goals (leaderboard)
discover.get("/leaderboard", optionalAuthMiddleware, async (c) => {
  const topUsers = await prisma.user.findMany({
    where: {
      isPublic: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      _count: {
        select: {
          goals: {
            where: {
              isCompleted: true,
            },
          },
        },
      },
    },
    orderBy: {
      goals: {
        _count: "desc",
      },
    },
    take: 3,
  });

  const leaderboard = topUsers.map((user, index) => ({
    rank: index + 1,
    id: user.id,
    name: user.name || user.email,
    avatarUrl: user.avatarUrl,
    completedGoals: user._count.goals,
  }));

  return c.json({ success: true, leaderboard });
});

export default discover;
