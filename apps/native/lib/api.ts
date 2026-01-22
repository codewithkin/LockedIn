import { env } from "@LockedIn/env/native";
import * as SecureStore from "expo-secure-store";

const API_URL = env.EXPO_PUBLIC_SERVER_URL;
const TOKEN_KEY = "auth_token";

// Token management
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// API client
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// Auth API
export const authApi = {
  requestMagicLink: (email: string) =>
    request<{ success: boolean; message: string }>("/api/auth/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  verifyToken: (token: string) =>
    request<{
      success: boolean;
      user: User;
      token: string;
    }>("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  getMe: () =>
    request<{ success: boolean; user: User }>("/api/auth/me"),

  updateProfile: (data: { name?: string; avatarUrl?: string; pushToken?: string }) =>
    request<{ success: boolean; user: User }>("/api/auth/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Goals API
export const goalsApi = {
  getAll: () =>
    request<{ success: boolean; goals: Goal[] }>("/api/goals"),

  getById: (id: string) =>
    request<{ success: boolean; goal: Goal }>(`/api/goals/${id}`),

  create: (data: CreateGoalInput) =>
    request<{ success: boolean; goal: Goal }>("/api/goals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateGoalInput>) =>
    request<{ success: boolean; goal: Goal }>(`/api/goals/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/api/goals/${id}`, {
      method: "DELETE",
    }),

  addUpdate: (goalId: string, data: CreateGoalUpdateInput) =>
    request<{ success: boolean; update: GoalUpdate; goal: Goal }>(
      `/api/goals/${goalId}/updates`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),
};

// Groups API
export const groupsApi = {
  getAll: () =>
    request<{ success: boolean; groups: Group[] }>("/api/groups"),

  getById: (id: string) =>
    request<{ success: boolean; group: Group }>(`/api/groups/${id}`),

  create: (data: CreateGroupInput) =>
    request<{ success: boolean; group: Group }>("/api/groups", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  join: (inviteCode: string) =>
    request<{ success: boolean; group: Group }>("/api/groups/join", {
      method: "POST",
      body: JSON.stringify({ inviteCode }),
    }),

  leave: (id: string) =>
    request<{ success: boolean }>(`/api/groups/${id}/leave`, {
      method: "DELETE",
    }),

  update: (id: string, data: Partial<CreateGroupInput>) =>
    request<{ success: boolean; group: Group }>(`/api/groups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Gang API
export const gangApi = {
  getMembers: () =>
    request<{ success: boolean; members: GangMember[] }>("/api/gang"),

  getRequests: () =>
    request<{ success: boolean; requests: GangRequest[] }>("/api/gang/requests"),

  sendRequest: (email: string) =>
    request<{ success: boolean; request: GangRequest }>("/api/gang/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  acceptRequest: (requestId: string) =>
    request<{ success: boolean }>(`/api/gang/requests/${requestId}/accept`, {
      method: "POST",
    }),

  declineRequest: (requestId: string) =>
    request<{ success: boolean }>(`/api/gang/requests/${requestId}/decline`, {
      method: "POST",
    }),

  removeMember: (memberId: string) =>
    request<{ success: boolean }>(`/api/gang/${memberId}`, {
      method: "DELETE",
    }),
};

// Notifications API
export const notificationsApi = {
  getAll: () =>
    request<{ success: boolean; notifications: Notification[] }>("/api/notifications"),

  getUnreadCount: () =>
    request<{ success: boolean; count: number }>("/api/notifications/unread-count"),

  markAsRead: (id: string) =>
    request<{ success: boolean }>(`/api/notifications/${id}/read`, {
      method: "PATCH",
    }),

  markAllAsRead: () =>
    request<{ success: boolean }>("/api/notifications/read-all", {
      method: "PATCH",
    }),

  delete: (id: string) =>
    request<{ success: boolean }>(`/api/notifications/${id}`, {
      method: "DELETE",
    }),
};

// Discover API (public endpoints)
export const discoverApi = {
  getPublicGroups: (search?: string) =>
    request<{ success: boolean; groups: DiscoverGroup[] }>(
      `/api/discover/groups${search ? `?search=${encodeURIComponent(search)}` : ""}`
    ),

  getPublicPeople: (search?: string) =>
    request<{ success: boolean; people: DiscoverPerson[] }>(
      `/api/discover/people${search ? `?search=${encodeURIComponent(search)}` : ""}`
    ),

  getStats: () =>
    request<{ success: boolean; platform: PlatformStats; user: UserStats | null }>(
      "/api/discover/stats"
    ),

  getLeaderboard: () =>
    request<{ success: boolean; leaderboard: LeaderboardUser[] }>(
      "/api/discover/leaderboard"
    ),
};

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  image?: string;
  isPublic?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category?: string;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  isSurpassed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  groupId?: string;
  updates: GoalUpdate[];
  group?: { id: string; name: string };
}

export interface GoalUpdate {
  id: string;
  amount: number;
  note?: string;
  proofUrl?: string;
  proofType?: "image" | "document";
  createdAt: string;
  goalId: string;
  userId: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  inviteCode: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  members: GroupMember[];
  goals?: Goal[];
  _count?: { goals: number };
}

export interface GroupMember {
  id: string;
  role: "admin" | "member";
  joinedAt: string;
  userId: string;
  groupId: string;
  user?: User;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  targetValue: number;
  unit: string;
  category?: string;
  endDate: string;
  groupId?: string;
}

export interface CreateGoalUpdateInput {
  amount: number;
  note?: string;
  proofUrl?: string;
  proofType?: "image" | "document";
}

export interface CreateGroupInput {
  name: string;
  description?: string;
  isPublic?: boolean;
}

// Gang types
export interface GangMember {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  mutualSince: string;
}

export interface GangRequest {
  id: string;
  sender: {
    id: string;
    name?: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
  status: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

// Discover types
export interface DiscoverGroup {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  memberCount: number;
  goalCount: number;
  isMember: boolean;
  createdAt: string;
}

export interface DiscoverPerson {
  id: string;
  name?: string;
  email: string;
  avatarUrl?: string;
  goalCount: number;
  isFollowing: boolean;
  createdAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalGoals: number;
  completedGoals: number;
  totalPublicGroups: number;
}

export interface UserStats {
  totalGoals: number;
  completedGoals: number;
  surpassedGoals: number;
  activeGoals: number;
  groupCount: number;
  gangCount: number;
  avgProgress: number;
  categoryBreakdown: Array<{ category: string; count: number }>;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatarUrl?: string;
  completedGoals: number;
}
  gangCount: number;
  avgProgress: number;
  categoryBreakdown: { category: string; count: number }[];
}
