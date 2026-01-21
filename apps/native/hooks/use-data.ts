import { useState, useCallback, useEffect } from "react";
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
