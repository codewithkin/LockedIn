import { MotiView } from "moti";
import { Link, router } from "expo-router";
import { Button, Surface, Chip, useThemeColor } from "heroui-native";
import {
  Target,
  Users,
  TrendingUp,
  Flame,
  Award,
  Calendar,
  Plus,
  Bell,
  ChevronRight,
  BarChart3,
  Zap,
  CheckCircle,
  Clock,
  Trophy,
} from "lucide-react-native";
import { Text, View, Pressable, useWindowDimensions, ScrollView } from "react-native";
import { useState, useMemo } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, ScaleIn, AnimatedProgressBar } from "@/components/animations";
import { useGoals, useGroups } from "@/hooks/use-data";
import { useAuth } from "@/contexts/auth-context";

// Progress Ring Component
function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color,
  backgroundColor,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  backgroundColor: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View style={{ position: "absolute" }}>
        <MotiView
          from={{ rotate: "-90deg" }}
          animate={{ rotate: "-90deg" }}
          style={{ transform: [{ rotate: "-90deg" }] }}
        >
          {/* Background circle */}
          <View
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: backgroundColor,
            }}
          />
        </MotiView>
      </View>
      <View style={{ position: "absolute" }}>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 800, delay: 200 }}
        >
          {/* Progress circle - simplified for RN */}
          <View
            style={{
              width: size - strokeWidth * 2,
              height: size - strokeWidth * 2,
              borderRadius: (size - strokeWidth * 2) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: progress > 25 ? color : "transparent",
              borderRightColor: progress > 50 ? color : "transparent",
              borderBottomColor: progress > 75 ? color : "transparent",
              borderLeftColor: progress > 0 ? color : "transparent",
              transform: [{ rotate: `${(progress / 100) * 360 - 90}deg` }],
            }}
          />
        </MotiView>
      </View>
      {children}
    </View>
  );
}

// Category Card Component
function CategoryCard({
  title,
  time,
  progress,
  color,
  delay = 0,
}: {
  title: string;
  time: string;
  progress: number;
  color: string;
  delay?: number;
}) {
  const foregroundColor = useThemeColor("foreground");

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", delay }}
    >
      <Surface
        variant="secondary"
        className="p-4 rounded-2xl mr-3"
        style={{ width: 120, backgroundColor: color + "30" }}
      >
        <Text className="text-foreground font-semibold text-sm">{title}</Text>
        <Text className="text-muted text-xs mt-0.5">{time}</Text>
        <View className="mt-3 items-center">
          <ProgressRing
            progress={progress}
            size={48}
            strokeWidth={4}
            color={color}
            backgroundColor={color + "40"}
          >
            <Text className="text-foreground font-bold text-xs">{progress}%</Text>
          </ProgressRing>
        </View>
      </Surface>
    </MotiView>
  );
}

// Stat Pill Component
function StatPill({
  value,
  label,
  icon: Icon,
  color,
  delay = 0,
}: {
  value: number | string;
  label: string;
  icon: any;
  color: string;
  delay?: number;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay }}
      className="items-center"
    >
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mb-2"
        style={{ backgroundColor: color + "20" }}
      >
        <Icon size={22} color={color} />
      </View>
      <Text className="text-foreground font-bold text-lg">{value}</Text>
      <Text className="text-muted text-xs">{label}</Text>
    </MotiView>
  );
}

// Goal Preview Card
function GoalPreviewCard({
  goal,
  index = 0,
}: {
  goal: any;
  index?: number;
}) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");

  const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <SlideIn delay={index * 60}>
      <Pressable onPress={() => router.push(`/goal/${goal.id}`)}>
        {({ pressed }) => (
          <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: "timing", duration: 100 }}>
            <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-foreground font-semibold text-base" numberOfLines={1}>
                      {goal.title}
                    </Text>
                    {goal.isSurpassed && <Trophy size={14} color={accentColor} />}
                  </View>
                  <Text className="text-muted text-xs">
                    {goal.currentValue} / {goal.targetValue} {goal.unit !== "$" && goal.unit}
                  </Text>
                </View>
                <View className="items-end">
                  <Chip size="sm" color={daysRemaining <= 3 ? "danger" : "default"}>
                    <Clock size={10} color={foregroundColor} />
                    <Chip.Label className="ml-1">{daysRemaining}d</Chip.Label>
                  </Chip>
                </View>
              </View>

              {/* Progress dots */}
              <View className="flex-row gap-1 mt-3">
                {[...Array(14)].map((_, i) => {
                  const dotProgress = (progress / 100) * 14;
                  const isActive = i < dotProgress;
                  return (
                    <MotiView
                      key={i}
                      from={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 200 + i * 30 }}
                      className="flex-1 h-2 rounded-full"
                      style={{
                        backgroundColor: isActive ? successColor : foregroundColor + "20",
                      }}
                    />
                  );
                })}
              </View>
            </Surface>
          </MotiView>
        )}
      </Pressable>
    </SlideIn>
  );
}

export default function CockpitScreen() {
  const { goals, isLoading: goalsLoading } = useGoals();
  const { groups } = useGroups();
  const { user } = useAuth();
  const layout = useWindowDimensions();

  const foregroundColor = useThemeColor("foreground");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const accentColor = useThemeColor("accent");
  const dangerColor = useThemeColor("danger");
  const mutedColor = useThemeColor("muted");

  const isTablet = layout.width >= 768;

  // Stats
  const activeGoals = useMemo(() => goals.filter((g) => g.status === "active" || (!g.isCompleted && !g.status)), [goals]);
  const completedGoals = useMemo(() => goals.filter((g) => g.isCompleted || g.status === "completed"), [goals]);
  const surpassedGoals = useMemo(() => goals.filter((g) => g.isSurpassed), [goals]);
  const totalUpdates = useMemo(() => goals.reduce((acc, g) => acc + g.updates.length, 0), [goals]);

  // Current focus - first active goal
  const currentFocus = activeGoals[0];

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.name?.split(" ")[0] || "there";

  // Category breakdown (mock for now)
  const categories = [
    { title: "Health", time: "4:15 / 6h", progress: 65, color: successColor },
    { title: "Finance", time: "2:30 / 4h", progress: 45, color: warningColor },
    { title: "Learning", time: "1:00 / 2h", progress: 25, color: accentColor },
  ];

  return (
    <Container className="px-4 md:px-6 lg:px-8">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <FadeIn>
          <View className="py-6 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-muted text-sm">{getGreeting()},</Text>
              <Text className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {userName} 👋
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/notifications")}
              className="w-10 h-10 rounded-full bg-muted/20 items-center justify-center"
            >
              <Bell size={20} color={foregroundColor} />
            </Pressable>
          </View>
        </FadeIn>

        {/* Main Stats Row */}
        <SlideIn delay={100}>
          <Surface variant="secondary" className="p-5 rounded-3xl mb-6">
            <View className="flex-row items-center justify-around">
              <StatPill
                value={totalUpdates}
                label="Total Updates"
                icon={BarChart3}
                color={accentColor}
                delay={150}
              />
              <View className="w-px h-12 bg-muted/30" />
              <StatPill
                value={completedGoals.length}
                label="Completed"
                icon={CheckCircle}
                color={successColor}
                delay={200}
              />
              <View className="w-px h-12 bg-muted/30" />
              <StatPill
                value={surpassedGoals.length}
                label="Surpassed"
                icon={Trophy}
                color={warningColor}
                delay={250}
              />
            </View>
          </Surface>
        </SlideIn>

        {/* Category Cards */}
        <SlideIn delay={200}>
          <Text className="text-foreground font-semibold text-lg mb-3">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {categories.map((cat, index) => (
              <CategoryCard key={cat.title} {...cat} delay={250 + index * 50} />
            ))}
          </ScrollView>
        </SlideIn>

        {/* Current Focus */}
        {currentFocus && (
          <SlideIn delay={300}>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-foreground font-semibold text-lg">Current Focus</Text>
              <Chip size="sm" color="success">
                <Flame size={12} color="white" />
                <Chip.Label className="ml-1">Active</Chip.Label>
              </Chip>
            </View>
            <Surface variant="tertiary" className="p-5 rounded-3xl mb-6">
              <View className="flex-row items-center gap-4">
                <ProgressRing
                  progress={Math.round((currentFocus.currentValue / currentFocus.targetValue) * 100)}
                  size={72}
                  strokeWidth={6}
                  color={accentColor}
                  backgroundColor={accentColor + "30"}
                >
                  <Text className="text-foreground font-bold text-sm">
                    {Math.round((currentFocus.currentValue / currentFocus.targetValue) * 100)}%
                  </Text>
                </ProgressRing>
                <View className="flex-1">
                  <Text className="text-foreground font-bold text-lg">{currentFocus.title}</Text>
                  <Text className="text-muted text-sm mt-0.5">
                    {currentFocus.currentValue} / {currentFocus.targetValue} {currentFocus.unit}
                  </Text>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-3 self-start"
                    onPress={() => router.push(`/goal/update/${currentFocus.id}`)}
                  >
                    <TrendingUp size={14} color={foregroundColor} />
                    <Button.Label className="ml-1">Log Progress</Button.Label>
                  </Button>
                </View>
              </View>
            </Surface>
          </SlideIn>
        )}

        {/* Recent Goals */}
        <SlideIn delay={400}>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground font-semibold text-lg">Recent Goals</Text>
            <Pressable onPress={() => router.push("/(tabs)/goals")}>
              <Text className="text-accent text-sm font-medium">See All</Text>
            </Pressable>
          </View>

          {activeGoals.slice(0, 3).map((goal, index) => (
            <GoalPreviewCard key={goal.id} goal={goal} index={index} />
          ))}

          {activeGoals.length === 0 && (
            <Surface variant="secondary" className="p-8 rounded-2xl items-center">
              <Target size={32} color={mutedColor} />
              <Text className="text-muted text-sm mt-2">No active goals</Text>
              <Button size="sm" className="mt-4" onPress={() => router.push("/goal/new")}>
                <Plus size={16} color="white" />
                <Button.Label className="ml-1">Create Goal</Button.Label>
              </Button>
            </Surface>
          )}
        </SlideIn>

        {/* Quick Actions FAB */}
        <SlideIn delay={500}>
          <View className="flex-row gap-3 mt-4 mb-8">
            <Link href="/goal/new" asChild>
              <Pressable className="flex-1">
                {({ pressed }) => (
                  <MotiView animate={{ scale: pressed ? 0.95 : 1 }}>
                    <Surface
                      variant="secondary"
                      className="p-4 rounded-2xl flex-row items-center justify-center gap-2"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Plus size={18} color="white" />
                      <Text className="text-white font-semibold">New Goal</Text>
                    </Surface>
                  </MotiView>
                )}
              </Pressable>
            </Link>
            <Link href="/group/new" asChild>
              <Pressable className="flex-1">
                {({ pressed }) => (
                  <MotiView animate={{ scale: pressed ? 0.95 : 1 }}>
                    <Surface
                      variant="secondary"
                      className="p-4 rounded-2xl flex-row items-center justify-center gap-2"
                    >
                      <Users size={18} color={foregroundColor} />
                      <Text className="text-foreground font-semibold">New Group</Text>
                    </Surface>
                  </MotiView>
                )}
              </Pressable>
            </Link>
          </View>
        </SlideIn>
      </ScrollView>
    </Container>
  );
}
