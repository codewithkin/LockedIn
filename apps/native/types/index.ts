// Goal types
export type GoalStatus = "active" | "completed" | "failed" | "paused" | "given_up";
export type GoalTimeframe = "daily" | "weekly" | "monthly" | "custom";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  category?: string;
  status?: GoalStatus;
  timeframe?: GoalTimeframe;
  coverImageUrl?: string;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  isSurpassed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  groupId?: string;
  updates: GoalUpdate[];
}

export interface GoalUpdate {
  id: string;
  amount: number;
  note?: string;
  proofUrl?: string;
  proofType?: "image" | "document";
  createdAt: Date;
  goalId: string;
  userId: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  targetValue: number;
  unit: string;
  category?: string;
  timeframe?: GoalTimeframe;
  endDate: Date;
  groupId?: string;
}

export interface CreateGoalUpdateInput {
  goalId: string;
  amount: number;
  note?: string;
  proofUri?: string;
}

// Group types
export interface Group {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  inviteCode: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  members: GroupMember[];
  goals: Goal[];
}

export interface GroupMember {
  id: string;
  role: "admin" | "member";
  joinedAt: Date;
  userId: string;
  groupId: string;
  user?: User;
}

export interface CreateGroupInput {
  name: string;
  description?: string;
  isPublic?: boolean;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  image?: string;
  isPublic?: boolean;
  pushToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification types
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "goal_completed" | "goal_surpassed" | "group_invite" | "goal_update";
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
  userId: string;
}

// Goal categories
export const GOAL_CATEGORIES = [
  { value: "financial", label: "Financial", icon: "DollarSign" },
  { value: "fitness", label: "Fitness", icon: "Dumbbell" },
  { value: "learning", label: "Learning", icon: "BookOpen" },
  { value: "health", label: "Health", icon: "Heart" },
  { value: "career", label: "Career", icon: "Briefcase" },
  { value: "personal", label: "Personal", icon: "User" },
  { value: "creative", label: "Creative", icon: "Palette" },
  { value: "social", label: "Social", icon: "Users" },
] as const;

// Goal units
export const GOAL_UNITS = [
  { value: "$", label: "Dollars ($)" },
  { value: "hours", label: "Hours" },
  { value: "miles", label: "Miles" },
  { value: "km", label: "Kilometers" },
  { value: "books", label: "Books" },
  { value: "days", label: "Days" },
  { value: "sessions", label: "Sessions" },
  { value: "items", label: "Items" },
  { value: "%", label: "Percentage (%)" },
] as const;

export type GoalCategory = (typeof GOAL_CATEGORIES)[number]["value"];
export type GoalUnit = (typeof GOAL_UNITS)[number]["value"];
