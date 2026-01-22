import React, { useState, useCallback, useEffect } from "react";
import type { Goal, GoalUpdate, Group, GroupMember, CreateGoalInput, CreateGoalUpdateInput, CreateGroupInput } from "@/types";
import { goalsApi, groupsApi, getToken } from "@/lib/api";

// Mode can be "mock" or "api" - set to "api" when connected to backend
const USE_API = false;

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock current user
const CURRENT_USER_ID = "user_1";

// Initial mock data
const initialGoals: Goal[] = [
  {
    id: "goal_1",
    title: "Save $500 this month",
    description: "Building an emergency fund",
    targetValue: 500,
    currentValue: 127,
    unit: "$",
    category: "financial",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-01-31"),
    isCompleted: false,
    isSurpassed: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date(),
    userId: CURRENT_USER_ID,
    updates: [
      {
        id: "update_1",
        amount: 50,
        note: "Saved from groceries",
        proofUrl: undefined,
        createdAt: new Date("2026-01-05"),
        goalId: "goal_1",
        userId: CURRENT_USER_ID,
      },
      {
        id: "update_2",
        amount: 77,
        note: "Side hustle earnings",
        proofUrl: "https://picsum.photos/200",
        proofType: "image",
        createdAt: new Date("2026-01-12"),
        goalId: "goal_1",
        userId: CURRENT_USER_ID,
      },
    ],
  },
  {
    id: "goal_2",
    title: "Run 50 miles",
    description: "Monthly running challenge",
    targetValue: 50,
    currentValue: 23.5,
    unit: "miles",
    category: "fitness",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-01-31"),
    isCompleted: false,
    isSurpassed: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date(),
    userId: CURRENT_USER_ID,
    groupId: "group_1",
    updates: [
      {
        id: "update_3",
        amount: 5.2,
        note: "Morning run",
        createdAt: new Date("2026-01-03"),
        goalId: "goal_2",
        userId: CURRENT_USER_ID,
      },
      {
        id: "update_4",
        amount: 8.3,
        note: "Long weekend run",
        proofUrl: "https://picsum.photos/201",
        proofType: "image",
        createdAt: new Date("2026-01-07"),
        goalId: "goal_2",
        userId: CURRENT_USER_ID,
      },
      {
        id: "update_5",
        amount: 10,
        note: "5K race completed!",
        proofUrl: "https://picsum.photos/202",
        proofType: "image",
        createdAt: new Date("2026-01-14"),
        goalId: "goal_2",
        userId: CURRENT_USER_ID,
      },
    ],
  },
  {
    id: "goal_3",
    title: "Read 4 books",
    description: "Monthly reading goal",
    targetValue: 4,
    currentValue: 4,
    unit: "books",
    category: "learning",
    startDate: new Date("2025-12-01"),
    endDate: new Date("2025-12-31"),
    isCompleted: true,
    isSurpassed: true,
    completedAt: new Date("2025-12-28"),
    createdAt: new Date("2025-12-01"),
    updatedAt: new Date("2025-12-28"),
    userId: CURRENT_USER_ID,
    updates: [],
  },
];

const initialGroups: Group[] = [
  {
    id: "group_1",
    name: "Fitness Warriors",
    description: "Accountability group for fitness goals",
    inviteCode: "FIT2026",
    isPublic: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date(),
    ownerId: CURRENT_USER_ID,
    members: [
      {
        id: "member_1",
        role: "admin",
        joinedAt: new Date("2026-01-01"),
        userId: CURRENT_USER_ID,
        groupId: "group_1",
      },
      {
        id: "member_2",
        role: "member",
        joinedAt: new Date("2026-01-02"),
        userId: "user_2",
        groupId: "group_1",
      },
      {
        id: "member_3",
        role: "member",
        joinedAt: new Date("2026-01-03"),
        userId: "user_3",
        groupId: "group_1",
      },
    ],
    goals: [],
  },
  {
    id: "group_2",
    name: "Money Makers",
    description: "Track financial goals together",
    inviteCode: "MONEY26",
    isPublic: false,
    createdAt: new Date("2026-01-05"),
    updatedAt: new Date(),
    ownerId: "user_2",
    members: [
      {
        id: "member_4",
        role: "admin",
        joinedAt: new Date("2026-01-05"),
        userId: "user_2",
        groupId: "group_2",
      },
      {
        id: "member_5",
        role: "member",
        joinedAt: new Date("2026-01-06"),
        userId: CURRENT_USER_ID,
        groupId: "group_2",
      },
    ],
    goals: [],
  },
];

// Global store (in real app, this would be Zustand or similar)
let goalsStore = [...initialGoals];
let groupsStore = [...initialGroups];

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(goalsStore);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals on mount if using API
  useEffect(() => {
    if (USE_API) {
      fetchGoalsFromApi();
    }
  }, []);

  const fetchGoalsFromApi = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      if (!token) {
        setGoals([]);
        return;
      }
      const response = await goalsApi.getAll();
      if (response.success && response.goals) {
        // Convert API dates to Date objects
        const fetchedGoals = response.goals.map((g: any) => ({
          ...g,
          startDate: new Date(g.startDate),
          endDate: new Date(g.endDate),
          createdAt: new Date(g.createdAt),
          updatedAt: new Date(g.updatedAt),
          completedAt: g.completedAt ? new Date(g.completedAt) : undefined,
          updates: g.updates?.map((u: any) => ({
            ...u,
            createdAt: new Date(u.createdAt),
          })) || [],
        }));
        setGoals(fetchedGoals);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch goals");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshGoals = useCallback(() => {
    if (USE_API) {
      fetchGoalsFromApi();
    } else {
      setGoals([...goalsStore]);
    }
  }, []);

  const createGoal = useCallback(async (input: CreateGoalInput): Promise<Goal> => {
    setIsLoading(true);
    
    if (USE_API) {
      try {
        const response = await goalsApi.create({
          title: input.title,
          description: input.description,
          targetValue: input.targetValue,
          unit: input.unit,
          category: input.category,
          endDate: input.endDate instanceof Date ? input.endDate.toISOString() : input.endDate,
          groupId: input.groupId,
        });
        if (response.success && response.goal) {
          await fetchGoalsFromApi();
          return response.goal as any;
        }
        throw new Error("Failed to create goal");
      } finally {
        setIsLoading(false);
      }
    }

    await new Promise((r) => setTimeout(r, 500)); // Simulate API delay

    const newGoal: Goal = {
      id: generateId(),
      ...input,
      currentValue: 0,
      startDate: new Date(),
      isCompleted: false,
      isSurpassed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: CURRENT_USER_ID,
      updates: [],
    };

    goalsStore = [...goalsStore, newGoal];
    setGoals([...goalsStore]);
    setIsLoading(false);
    return newGoal;
  }, []);

  const addGoalUpdate = useCallback(
    async (input: CreateGoalUpdateInput): Promise<GoalUpdate> => {
      setIsLoading(true);
      
      if (USE_API) {
        try {
          const response = await goalsApi.addUpdate(input.goalId, {
            amount: input.amount,
            note: input.note,
            proofUrl: input.proofUri,
            proofType: input.proofUri ? "image" : undefined,
          });
          if (response.success && response.update) {
            await fetchGoalsFromApi();
            return response.update as any;
          }
          throw new Error("Failed to add update");
        } finally {
          setIsLoading(false);
        }
      }

      await new Promise((r) => setTimeout(r, 500));

      const goalIndex = goalsStore.findIndex((g) => g.id === input.goalId);
      if (goalIndex === -1) throw new Error("Goal not found");

      const newUpdate: GoalUpdate = {
        id: generateId(),
        amount: input.amount,
        note: input.note,
        proofUrl: input.proofUri,
        proofType: input.proofUri ? "image" : undefined,
        createdAt: new Date(),
        goalId: input.goalId,
        userId: CURRENT_USER_ID,
      };

      const goal = goalsStore[goalIndex];
      const newCurrentValue = goal.currentValue + input.amount;
      const isCompleted = newCurrentValue >= goal.targetValue;
      const isSurpassed = newCurrentValue > goal.targetValue;

      goalsStore[goalIndex] = {
        ...goal,
        currentValue: newCurrentValue,
        isCompleted,
        isSurpassed,
        completedAt: isCompleted && !goal.completedAt ? new Date() : goal.completedAt,
        updatedAt: new Date(),
        updates: [...goal.updates, newUpdate],
      };

      setGoals([...goalsStore]);
      setIsLoading(false);
      return newUpdate;
    },
    []
  );

  const deleteGoal = useCallback(async (goalId: string) => {
    setIsLoading(true);
    
    if (USE_API) {
      try {
        await goalsApi.delete(goalId);
        await fetchGoalsFromApi();
      } finally {
        setIsLoading(false);
      }
      return;
    }

    await new Promise((r) => setTimeout(r, 300));
    goalsStore = goalsStore.filter((g) => g.id !== goalId);
    setGoals([...goalsStore]);
    setIsLoading(false);
  }, []);

  const getGoalById = useCallback((goalId: string) => {
    if (USE_API) {
      return goals.find((g) => g.id === goalId);
    }
    return goalsStore.find((g) => g.id === goalId);
  }, [goals]);

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

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>(groupsStore);
  const [isLoading, setIsLoading] = useState(false);

  const refreshGroups = useCallback(() => {
    setGroups([...groupsStore]);
  }, []);

  const createGroup = useCallback(async (input: CreateGroupInput): Promise<Group> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const newGroup: Group = {
      id: generateId(),
      ...input,
      inviteCode: generateId().toUpperCase().slice(0, 6),
      isPublic: input.isPublic ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: CURRENT_USER_ID,
      members: [
        {
          id: generateId(),
          role: "admin",
          joinedAt: new Date(),
          userId: CURRENT_USER_ID,
          groupId: "",
        },
      ],
      goals: [],
    };
    newGroup.members[0].groupId = newGroup.id;

    groupsStore = [...groupsStore, newGroup];
    setGroups([...groupsStore]);
    setIsLoading(false);
    return newGroup;
  }, []);

  const joinGroup = useCallback(async (inviteCode: string): Promise<Group | null> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const groupIndex = groupsStore.findIndex(
      (g) => g.inviteCode.toLowerCase() === inviteCode.toLowerCase()
    );

    if (groupIndex === -1) {
      setIsLoading(false);
      return null;
    }

    const group = groupsStore[groupIndex];
    const alreadyMember = group.members.some((m) => m.userId === CURRENT_USER_ID);

    if (!alreadyMember) {
      const newMember: GroupMember = {
        id: generateId(),
        role: "member",
        joinedAt: new Date(),
        userId: CURRENT_USER_ID,
        groupId: group.id,
      };

      groupsStore[groupIndex] = {
        ...group,
        members: [...group.members, newMember],
        updatedAt: new Date(),
      };
    }

    setGroups([...groupsStore]);
    setIsLoading(false);
    return groupsStore[groupIndex];
  }, []);

  const leaveGroup = useCallback(async (groupId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    const groupIndex = groupsStore.findIndex((g) => g.id === groupId);
    if (groupIndex !== -1) {
      const group = groupsStore[groupIndex];
      groupsStore[groupIndex] = {
        ...group,
        members: group.members.filter((m) => m.userId !== CURRENT_USER_ID),
        updatedAt: new Date(),
      };
    }

    setGroups([...groupsStore]);
    setIsLoading(false);
  }, []);

  const getGroupById = useCallback((groupId: string) => {
    return groupsStore.find((g) => g.id === groupId);
  }, []);

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

type GangMember = {
  id: string;
  name: string;
  email: string;
  image?: string;
  mutualSince: Date;
};

type GangRequest = {
  id: string;
  fromUser: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: Date;
};

// Mock gang data
let gangMembersStore: GangMember[] = [
  { id: "gang_1", name: "Alex Chen", email: "alex@example.com", mutualSince: new Date("2025-01-15") },
  { id: "gang_2", name: "Sarah Johnson", email: "sarah@example.com", mutualSince: new Date("2025-01-20") },
  { id: "gang_3", name: "Mike Wilson", email: "mike@example.com", mutualSince: new Date("2025-02-01") },
];

let gangRequestsStore: GangRequest[] = [
  {
    id: "req_1",
    fromUser: { id: "user_5", name: "John Doe", email: "john@example.com" },
    createdAt: new Date("2025-02-18"),
  },
];

export function useGang() {
  const [members, setMembers] = useState<GangMember[]>(gangMembersStore);
  const [requests, setRequests] = useState<GangRequest[]>(gangRequestsStore);
  const [isLoading, setIsLoading] = useState(false);

  const refreshGang = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setMembers([...gangMembersStore]);
    setRequests([...gangRequestsStore]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshGang();
  }, [refreshGang]);

  const sendRequest = useCallback(async (toUserId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    // In real app, this would call the API
    setIsLoading(false);
    return true;
  }, []);

  const acceptRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    const request = gangRequestsStore.find((r) => r.id === requestId);
    if (request) {
      // Add to members
      const newMember: GangMember = {
        id: request.fromUser.id,
        name: request.fromUser.name,
        email: request.fromUser.email,
        image: request.fromUser.image,
        mutualSince: new Date(),
      };
      gangMembersStore = [...gangMembersStore, newMember];

      // Remove from requests
      gangRequestsStore = gangRequestsStore.filter((r) => r.id !== requestId);

      setMembers([...gangMembersStore]);
      setRequests([...gangRequestsStore]);
    }

    setIsLoading(false);
  }, []);

  const declineRequest = useCallback(async (requestId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    gangRequestsStore = gangRequestsStore.filter((r) => r.id !== requestId);
    setRequests([...gangRequestsStore]);

    setIsLoading(false);
  }, []);

  const removeMember = useCallback(async (memberId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    gangMembersStore = gangMembersStore.filter((m) => m.id !== memberId);
    setMembers([...gangMembersStore]);

    setIsLoading(false);
  }, []);

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

// ============== User Hook ==============

interface UserData {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isPublic: boolean;
  createdAt: Date;
}

// Mock user data
const mockUser: UserData = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  isPublic: true,
  createdAt: new Date("2025-12-01"),
};

export function useUser() {
  const [user, setUser] = useState<UserData | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setUser({ ...mockUser });
    setIsLoading(false);
  }, []);

  const updateUser = useCallback(async (updates: Partial<UserData>) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
    setIsLoading(false);
  }, []);

  return {
    user,
    isLoading,
    error,
    refreshUser,
    updateUser,
  };
}

// ============== Notifications Hook ==============

interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: "goal_completed" | "goal_surpassed" | "group_invite" | "goal_update" | "gang_request";
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

// Mock notifications
let notificationsStore: NotificationData[] = [
  {
    id: "notif_1",
    title: "Goal Completed!",
    body: "You completed your 'Read 4 books' goal!",
    type: "goal_completed",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "notif_2",
    title: "New Gang Request",
    body: "Sarah Johnson wants to connect with you",
    type: "gang_request",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "notif_3",
    title: "Group Invite",
    body: "You've been invited to join 'Morning Runners'",
    type: "group_invite",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>(notificationsStore);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const refreshNotifications = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setNotifications([...notificationsStore]);
    setIsLoading(false);
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));

    const index = notificationsStore.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      notificationsStore[index] = { ...notificationsStore[index], isRead: true };
    }

    setNotifications([...notificationsStore]);
    setIsLoading(false);
  }, []);

  const markAllAsRead = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    notificationsStore = notificationsStore.map((n) => ({ ...n, isRead: true }));
    setNotifications([...notificationsStore]);
    setIsLoading(false);
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 200));

    notificationsStore = notificationsStore.filter((n) => n.id !== notificationId);
    setNotifications([...notificationsStore]);
    setIsLoading(false);
  }, []);

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

// ============== Crews Hook ==============

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

// Mock crew data
let crewsStore: CrewData[] = [
  {
    id: "crew_1",
    name: "Morning Hustlers",
    description: "Early risers achieving their dreams",
    memberCount: 12,
    goalCount: 8,
    isOwner: true,
    createdAt: new Date("2025-01-15"),
  },
  {
    id: "crew_2",
    name: "Code Warriors",
    description: "Developers building the future",
    memberCount: 25,
    goalCount: 15,
    isOwner: false,
    createdAt: new Date("2025-01-20"),
  },
];

export function useCrews() {
  const [crews, setCrews] = useState<CrewData[]>(crewsStore);
  const [isLoading, setIsLoading] = useState(false);

  const myCrews = crews.filter((c) => c.isOwner);
  const joinedCrews = crews.filter((c) => !c.isOwner);

  const refreshCrews = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setCrews([...crewsStore]);
    setIsLoading(false);
  }, []);

  const createCrew = useCallback(async (input: { name: string; description?: string }) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const newCrew: CrewData = {
      id: generateId(),
      name: input.name,
      description: input.description,
      memberCount: 1,
      goalCount: 0,
      isOwner: true,
      createdAt: new Date(),
    };

    crewsStore = [...crewsStore, newCrew];
    setCrews([...crewsStore]);
    setIsLoading(false);
    return newCrew;
  }, []);

  const leaveCrew = useCallback(async (crewId: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));

    crewsStore = crewsStore.filter((c) => c.id !== crewId);
    setCrews([...crewsStore]);
    setIsLoading(false);
  }, []);

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

// ============== Analytics Hook ==============

interface AnalyticsData {
  goalsCompleted: number;
  goalsSurpassed: number;
  totalProgress: number;
  weeklyProgress: { day: string; value: number }[];
  categoryBreakdown: { category: string; count: number; color: string }[];
  monthlyTrends: { month: string; completed: number; active: number }[];
}

export function useAnalytics() {
  const { goals } = useGoals();
  const [isLoading, setIsLoading] = useState(false);

  const analytics: AnalyticsData = React.useMemo(() => {
    const completed = goals.filter((g) => g.isCompleted);
    const surpassed = goals.filter((g) => g.isSurpassed);
    const active = goals.filter((g) => !g.isCompleted);

    // Calculate total progress across all active goals
    const totalProgress = active.length > 0
      ? active.reduce((acc, g) => acc + (g.currentValue / g.targetValue) * 100, 0) / active.length
      : 0;

    // Weekly progress (mock data for now)
    const weeklyProgress = [
      { day: 'Mon', value: 3 },
      { day: 'Tue', value: 5 },
      { day: 'Wed', value: 2 },
      { day: 'Thu', value: 8 },
      { day: 'Fri', value: 4 },
      { day: 'Sat', value: 6 },
      { day: 'Sun', value: 3 },
    ];

    // Category breakdown
    const categoryMap = new Map<string, number>();
    goals.forEach((g) => {
      const cat = g.category || 'other';
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });

    const categoryColors: Record<string, string> = {
      financial: '#22c55e',
      fitness: '#3b82f6',
      health: '#ef4444',
      learning: '#a855f7',
      personal: '#f59e0b',
      other: '#6b7280',
    };

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      color: categoryColors[category] || '#6b7280',
    }));

    // Monthly trends (mock data)
    const monthlyTrends = [
      { month: 'Oct', completed: 2, active: 5 },
      { month: 'Nov', completed: 4, active: 3 },
      { month: 'Dec', completed: 3, active: 4 },
      { month: 'Jan', completed: completed.length, active: active.length },
    ];

    return {
      goalsCompleted: completed.length,
      goalsSurpassed: surpassed.length,
      totalProgress: Math.round(totalProgress),
      weeklyProgress,
      categoryBreakdown,
      monthlyTrends,
    };
  }, [goals]);

  return {
    analytics,
    isLoading,
  };
}
