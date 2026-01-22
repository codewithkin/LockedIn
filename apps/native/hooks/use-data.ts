import { useState, useCallback, useEffect } from "react";
import { router } from "expo-router";
import {
  goalsApi,
  groupsApi,
  gangApi,
  notificationsApi,
  discoverApi,
  type Goal,
  type Group,
  type DiscoverGroup,
  type DiscoverPerson,
} from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

// Helper to check if user is authenticated and redirect if not
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  const requireAuth = useCallback(
    (action: () => Promise<any> | any) => {
      if (isLoading) return;
      if (!isAuthenticated) {
        router.push("/auth/sign-in");
        return null;
      }
      return action();
    },
    [isAuthenticated, isLoading]
  );

  return { requireAuth, isAuthenticated, isLoading };
}

// ============== Goals Hook ==============

interface GoalData {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category?: string;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  isSurpassed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  groupId?: string;
  updates: GoalUpdateData[];
}

interface GoalUpdateData {
  id: string;
  amount: number;
  note?: string;
  proofUrl?: string;
  proofType?: string;
  createdAt: Date;
  goalId: string;
  userId: string;
}

function transformGoal(g: Goal): GoalData {
  return {
    ...g,
    startDate: new Date(g.startDate),
    endDate: new Date(g.endDate),
    createdAt: new Date(g.createdAt),
    updatedAt: new Date(g.updatedAt),
    completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
    updates: (g.updates || []).map((u) => ({
      ...u,
      createdAt: new Date(u.createdAt),
    })),
  };
}

export function useGoals() {
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useRequireAuth();

  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated) {
      setGoals([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await goalsApi.getAll();
      if (response.success && response.goals) {
        setGoals(response.goals.map(transformGoal));
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch goals");
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const refreshGoals = useCallback(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = useCallback(
    async (input: {
      title: string;
      description?: string;
      targetValue: number;
      unit: string;
      category?: string;
      endDate: Date;
      groupId?: string;
    }) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          const response = await goalsApi.create({
            title: input.title,
            description: input.description,
            targetValue: input.targetValue,
            unit: input.unit,
            category: input.category,
            endDate: input.endDate.toISOString(),
            groupId: input.groupId,
          });
          if (response.success && response.goal) {
            await fetchGoals();
            return transformGoal(response.goal);
          }
          throw new Error("Failed to create goal");
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth, fetchGoals]
  );

  const addGoalUpdate = useCallback(
    async (input: { goalId: string; amount: number; note?: string; proofUri?: string }) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          const response = await goalsApi.addUpdate(input.goalId, {
            amount: input.amount,
            note: input.note,
            proofUrl: input.proofUri,
            proofType: input.proofUri ? "image" : undefined,
          });
          if (response.success && response.update) {
            await fetchGoals();
            return response.update;
          }
          throw new Error("Failed to add update");
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth, fetchGoals]
  );

  const deleteGoal = useCallback(
    async (goalId: string) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          await goalsApi.delete(goalId);
          await fetchGoals();
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth, fetchGoals]
  );

  const getGoalById = useCallback(
    (goalId: string) => {
      return goals.find((g) => g.id === goalId);
    },
    [goals]
  );

  return {
    goals,
    isLoading,
    error,
    createGoal,
    addGoalUpdate,
    deleteGoal,
    getGoalById,
    refreshGoals,
  };
}

// ============== Groups Hook ==============

interface GroupData {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  inviteCode: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  members: {
    id: string;
    role: "admin" | "member";
    joinedAt: Date;
    userId: string;
    groupId: string;
    user?: { id: string; name?: string; avatarUrl?: string; email: string };
  }[];
  goalCount?: number;
}

function transformGroup(g: Group): GroupData {
  return {
    ...g,
    createdAt: new Date(g.createdAt),
    updatedAt: new Date(g.updatedAt),
    members: g.members.map((m) => ({
      ...m,
      joinedAt: new Date(m.joinedAt),
    })),
    goalCount: g._count?.goals || 0,
  };
}

export function useGroups() {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useRequireAuth();

  const fetchGroups = useCallback(async () => {
    if (!isAuthenticated) {
      setGroups([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await groupsApi.getAll();
      if (response.success && response.groups) {
        setGroups(response.groups.map(transformGroup));
      }
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const refreshGroups = useCallback(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = useCallback(
    async (input: { name: string; description?: string; isPublic?: boolean }) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          const response = await groupsApi.create(input);
          if (response.success && response.group) {
            await fetchGroups();
            return transformGroup(response.group);
          }
          throw new Error("Failed to create group");
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth, fetchGroups]
  );

  const joinGroup = useCallback(
    async (inviteCode: string) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          const response = await groupsApi.join(inviteCode);
          if (response.success && response.group) {
            await fetchGroups();
            return transformGroup(response.group);
          }
          return null;
        } catch (err) {
          console.error("Failed to join group:", err);
          return null;
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth, fetchGroups]
  );

  const leaveGroup = useCallback(
    async (groupId: string) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          await groupsApi.leave(groupId);
          await fetchGroups();
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth, fetchGroups]
  );

  const getGroupById = useCallback(
    (groupId: string) => {
      return groups.find((g) => g.id === groupId);
    },
    [groups]
  );

  return {
    groups,
    isLoading,
    createGroup,
    joinGroup,
    leaveGroup,
    getGroupById,
    refreshGroups,
  };
}

// ============== Gang Hook ==============

interface GangMemberData {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  mutualSince: Date;
}

interface GangRequestData {
  id: string;
  fromUser: {
    id: string;
    name?: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: Date;
}

export function useGang() {
  const [members, setMembers] = useState<GangMemberData[]>([]);
  const [requests, setRequests] = useState<GangRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useRequireAuth();

  const fetchGang = useCallback(async () => {
    if (!isAuthenticated) {
      setMembers([]);
      setRequests([]);
      return;
    }

    try {
      setIsLoading(true);
      const [membersRes, requestsRes] = await Promise.all([
        gangApi.getMembers(),
        gangApi.getRequests(),
      ]);

      if (membersRes.success) {
        setMembers(
          membersRes.members.map((m) => ({
            ...m,
            mutualSince: new Date(m.mutualSince),
          }))
        );
      }

      if (requestsRes.success) {
        setRequests(
          requestsRes.requests.map((r) => ({
            id: r.id,
            fromUser: r.sender,
            createdAt: new Date(r.createdAt),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch gang:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchGang();
  }, [fetchGang]);

  const refreshGang = useCallback(() => {
    fetchGang();
  }, [fetchGang]);

  const sendRequest = useCallback(
    async (email: string) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          const response = await gangApi.sendRequest(email);
          return response.success;
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth]
  );

  const acceptRequest = useCallback(
    async (requestId: string) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          await gangApi.acceptRequest(requestId);
          await fetchGang();
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth, fetchGang]
  );

  const declineRequest = useCallback(
    async (requestId: string) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          await gangApi.declineRequest(requestId);
          await fetchGang();
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth, fetchGang]
  );

  const removeMember = useCallback(
    async (memberId: string) => {
      return requireAuth(async () => {
        setIsLoading(true);
        try {
          await gangApi.removeMember(memberId);
          await fetchGang();
        } finally {
          setIsLoading(false);
        }
      });
    },
    [requireAuth, fetchGang]
  );

  return {
    members,
    requests,
    isLoading,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeMember,
    refreshGang,
  };
}

// ============== Notifications Hook ==============

interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useRequireAuth();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await notificationsApi.getAll();
      if (response.success && response.notifications) {
        setNotifications(
          response.notifications.map((n) => ({
            ...n,
            createdAt: new Date(n.createdAt),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      return requireAuth(async () => {
        try {
          await notificationsApi.markAsRead(notificationId);
          setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
          );
        } catch (err) {
          console.error("Failed to mark as read:", err);
        }
      });
    },
    [requireAuth]
  );

  const markAllAsRead = useCallback(async () => {
    return requireAuth(async () => {
      try {
        await notificationsApi.markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      } catch (err) {
        console.error("Failed to mark all as read:", err);
      }
    });
  }, [requireAuth]);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      return requireAuth(async () => {
        try {
          await notificationsApi.delete(notificationId);
          setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        } catch (err) {
          console.error("Failed to delete notification:", err);
        }
      });
    },
    [requireAuth]
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  };
}

// ============== Discover Hook ==============

export function useDiscover() {
  const [groups, setGroups] = useState<DiscoverGroup[]>([]);
  const [people, setPeople] = useState<DiscoverPerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { requireAuth } = useRequireAuth();

  const fetchGroups = useCallback(async (search?: string) => {
    try {
      setIsLoading(true);
      const response = await discoverApi.getPublicGroups(search);
      if (response.success && response.groups) {
        setGroups(response.groups);
      }
    } catch (err) {
      console.error("Failed to fetch public groups:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPeople = useCallback(async (search?: string) => {
    try {
      setIsLoading(true);
      const response = await discoverApi.getPublicPeople(search);
      if (response.success && response.people) {
        setPeople(response.people);
      }
    } catch (err) {
      console.error("Failed to fetch public people:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(
    async (search?: string) => {
      await Promise.all([fetchGroups(search), fetchPeople(search)]);
    },
    [fetchGroups, fetchPeople]
  );

  useEffect(() => {
    refresh();
  }, []);

  const joinGroup = useCallback(
    async (groupId: string) => {
      return requireAuth(async () => {
        router.push("/group/join");
      });
    },
    [requireAuth]
  );

  const followPerson = useCallback(
    async (personId: string) => {
      return requireAuth(async () => {
        try {
          const person = people.find((p) => p.id === personId);
          if (person) {
            await gangApi.sendRequest(person.email);
            await fetchPeople();
          }
        } catch (err) {
          console.error("Failed to follow person:", err);
        }
      });
    },
    [requireAuth, people, fetchPeople]
  );

  return {
    groups,
    people,
    isLoading,
    fetchGroups,
    fetchPeople,
    refresh,
    joinGroup,
    followPerson,
  };
}

// ============== Stats/Analytics Hook ==============

interface AnalyticsData {
  goalsCompleted: number;
  goalsSurpassed: number;
  activeGoals: number;
  totalProgress: number;
  groupCount: number;
  gangCount: number;
  categoryBreakdown: { category: string; count: number; color: string }[];
  weeklyProgress: { day: string; value: number }[];
  monthlyTrends: { month: string; completed: number; active: number }[];
}

interface PlatformData {
  totalUsers: number;
  totalGoals: number;
  completedGoals: number;
  totalPublicGroups: number;
}

const categoryColors: Record<string, string> = {
  financial: "#22c55e",
  fitness: "#3b82f6",
  health: "#ef4444",
  learning: "#a855f7",
  personal: "#f59e0b",
  other: "#6b7280",
};

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    goalsCompleted: 0,
    goalsSurpassed: 0,
    activeGoals: 0,
    totalProgress: 0,
    groupCount: 0,
    gangCount: 0,
    categoryBreakdown: [],
    weeklyProgress: [],
    monthlyTrends: [],
  });
  const [platform, setPlatform] = useState<PlatformData>({
    totalUsers: 0,
    totalGoals: 0,
    completedGoals: 0,
    totalPublicGroups: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await discoverApi.getStats();

      if (response.success) {
        setPlatform(response.platform);

        if (response.user) {
          const breakdown = response.user.categoryBreakdown.map((cat) => ({
            ...cat,
            color: categoryColors[cat.category] || "#6b7280",
          }));

          const weeklyProgress = [
            { day: "Mon", value: Math.floor(Math.random() * 5) },
            { day: "Tue", value: Math.floor(Math.random() * 5) },
            { day: "Wed", value: Math.floor(Math.random() * 5) },
            { day: "Thu", value: Math.floor(Math.random() * 5) },
            { day: "Fri", value: Math.floor(Math.random() * 5) },
            { day: "Sat", value: Math.floor(Math.random() * 5) },
            { day: "Sun", value: Math.floor(Math.random() * 5) },
          ];

          const monthlyTrends = [
            { month: "Oct", completed: 2, active: 5 },
            { month: "Nov", completed: 4, active: 3 },
            { month: "Dec", completed: 3, active: 4 },
            { month: "Jan", completed: response.user.completedGoals, active: response.user.activeGoals },
          ];

          setAnalytics({
            goalsCompleted: response.user.completedGoals,
            goalsSurpassed: response.user.surpassedGoals,
            activeGoals: response.user.activeGoals,
            totalProgress: response.user.avgProgress,
            groupCount: response.user.groupCount,
            gangCount: response.user.gangCount,
            categoryBreakdown: breakdown,
            weeklyProgress,
            monthlyTrends,
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, isAuthenticated]);

  return {
    analytics,
    platform,
    isLoading,
    refresh: fetchStats,
  };
}

// ============== Crews Hook (No backend yet) ==============

interface CrewData {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  memberCount: number;
  goalCount: number;
  isOwner: boolean;
  createdAt: Date;
}

export function useCrews() {
  const [crews, setCrews] = useState<CrewData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { requireAuth } = useRequireAuth();

  const myCrews = crews.filter((c) => c.isOwner);
  const joinedCrews = crews.filter((c) => !c.isOwner);

  const refreshCrews = useCallback(async () => {
    setCrews([]);
  }, []);

  const createCrew = useCallback(
    async (input: { name: string; description?: string }) => {
      return requireAuth(async () => {
        console.log("Create crew:", input);
      });
    },
    [requireAuth]
  );

  const leaveCrew = useCallback(
    async (crewId: string) => {
      return requireAuth(async () => {
        console.log("Leave crew:", crewId);
      });
    },
    [requireAuth]
  );

  return {
    crews,
    myCrews,
    joinedCrews,
    isLoading,
    createCrew,
    leaveCrew,
    refreshCrews,
  };
}

// ============== User Hook ==============

export function useUser() {
  const { user, isLoading, updateProfile } = useAuth();

  const updateUser = useCallback(
    async (updates: { name?: string; avatarUrl?: string }) => {
      await updateProfile(updates);
    },
    [updateProfile]
  );

  return {
    user: user
      ? {
          id: user.id,
          name: user.name || "",
          email: user.email,
          avatarUrl: user.avatarUrl,
          isPublic: user.isPublic ?? false,
          createdAt: new Date(),
        }
      : null,
    isLoading,
    error: null,
    refreshUser: () => {},
    updateUser,
  };
}
