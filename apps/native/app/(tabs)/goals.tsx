import { MotiView } from "moti";
import { router } from "expo-router";
import { Button, Surface, Chip, useThemeColor } from "heroui-native";
import {
  Target,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
  Flame,
  Trophy,
  Calendar,
  ChevronRight,
} from "lucide-react-native";
import { Text, View, Pressable, useWindowDimensions, ScrollView, FlatList } from "react-native";
import { useState, useMemo } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, AnimatedProgressBar } from "@/components/animations";
import { SimpleTabBar } from "@/components/tabs";
import { useGoals } from "@/hooks/use-data";

type GoalStatus = "all" | "active" | "completed" | "failed" | "given_up" | "paused";
type TimeFilter = "all" | "daily" | "weekly" | "monthly";

const STATUS_TABS = [
  { key: "all", label: "All", icon: Target },
  { key: "active", label: "Active", icon: Flame },
  { key: "completed", label: "Completed", icon: CheckCircle },
  { key: "failed", label: "Failed", icon: XCircle },
  { key: "paused", label: "Paused", icon: Pause },
];

const TIME_TABS = ["All Time", "Daily", "Weekly", "Monthly"];

function GoalCard({ goal, index = 0 }: { goal: any; index?: number }) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const dangerColor = useThemeColor("danger");
  const warningColor = useThemeColor("warning");
  const mutedColor = useThemeColor("muted");

  const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const getStatusColor = () => {
    if (goal.status === "completed" || goal.isCompleted) return successColor;
    if (goal.status === "failed") return dangerColor;
    if (goal.status === "paused") return warningColor;
    if (goal.status === "given_up") return mutedColor;
    return accentColor;
  };

  const getStatusIcon = () => {
    if (goal.status === "completed" || goal.isCompleted) return CheckCircle;
    if (goal.status === "failed") return XCircle;
    if (goal.status === "paused") return Pause;
    if (goal.status === "given_up") return XCircle;
    return Flame;
  };

  const StatusIcon = getStatusIcon();

  return (
    <SlideIn delay={index * 50}>
      <Pressable onPress={() => router.push(`/goal/${goal.id}`)}>
        {({ pressed }) => (
          <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: "timing", duration: 100 }}>
            <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
              {/* Header */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-2">
                    <View
                      className="w-8 h-8 rounded-lg items-center justify-center"
                      style={{ backgroundColor: getStatusColor() + "20" }}
                    >
                      <StatusIcon size={16} color={getStatusColor()} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-semibold text-base" numberOfLines={1}>
                        {goal.title}
                      </Text>
                      {goal.description && (
                        <Text className="text-muted text-xs" numberOfLines={1}>
                          {goal.description}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                {goal.isSurpassed && (
                  <View className="flex-row items-center gap-1 bg-warning/20 px-2 py-1 rounded-full">
                    <Trophy size={12} color={warningColor} />
                    <Text className="text-warning text-xs font-medium">Surpassed</Text>
                  </View>
                )}
              </View>

              {/* Progress */}
              <View className="mb-3">
                <AnimatedProgressBar progress={progress} isSurpassed={goal.isSurpassed} />
              </View>

              {/* Footer */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Text className="text-muted text-xs">
                    {goal.currentValue} / {goal.targetValue} {goal.unit !== "$" && goal.unit}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <Clock size={12} color={mutedColor} />
                    <Text className="text-muted text-xs">{daysRemaining}d left</Text>
                  </View>
                </View>
                <Text className="text-accent font-semibold text-sm">{progress}%</Text>
              </View>

              {/* Progress dots (last 14 days) */}
              <View className="flex-row gap-1 mt-3">
                {[...Array(14)].map((_, i) => {
                  const hasUpdate = goal.updates?.some((u: any) => {
                    const updateDate = new Date(u.createdAt);
                    const targetDate = new Date();
                    targetDate.setDate(targetDate.getDate() - (13 - i));
                    return updateDate.toDateString() === targetDate.toDateString();
                  });
                  return (
                    <MotiView
                      key={i}
                      from={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 100 + i * 20 }}
                      className="flex-1 h-1.5 rounded-full"
                      style={{
                        backgroundColor: hasUpdate ? successColor : foregroundColor + "15",
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

export default function GoalsScreen() {
  const { goals, isLoading } = useGoals();
  const layout = useWindowDimensions();

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  const [statusFilter, setStatusFilter] = useState<GoalStatus>("all");
  const [timeFilterIndex, setTimeFilterIndex] = useState(0);

  const isTablet = layout.width >= 768;

  // Filter goals
  const filteredGoals = useMemo(() => {
    let filtered = [...goals];

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((g) => !g.isCompleted && g.status !== "completed" && g.status !== "failed" && g.status !== "paused" && g.status !== "given_up");
      } else if (statusFilter === "completed") {
        filtered = filtered.filter((g) => g.isCompleted || g.status === "completed");
      } else {
        filtered = filtered.filter((g) => g.status === statusFilter);
      }
    }

    // Time filter
    const now = new Date();
    if (timeFilterIndex === 1) {
      // Daily
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      filtered = filtered.filter((g) => {
        const end = new Date(g.endDate);
        return end >= today && end < tomorrow;
      });
    } else if (timeFilterIndex === 2) {
      // Weekly
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      filtered = filtered.filter((g) => {
        const end = new Date(g.endDate);
        return end >= startOfWeek && end < endOfWeek;
      });
    } else if (timeFilterIndex === 3) {
      // Monthly
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      filtered = filtered.filter((g) => {
        const end = new Date(g.endDate);
        return end >= startOfMonth && end <= endOfMonth;
      });
    }

    return filtered;
  }, [goals, statusFilter, timeFilterIndex]);

  // Current focus - first active goal
  const currentFocus = useMemo(
    () => goals.find((g) => !g.isCompleted && g.status !== "completed" && g.status !== "failed"),
    [goals]
  );

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Header */}
        <FadeIn>
          <View className="py-6 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-foreground">My Goals</Text>
              <Text className="text-muted text-sm mt-0.5">{goals.length} total goals</Text>
            </View>
            <Pressable
              onPress={() => router.push("/goal/new")}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: accentColor }}
            >
              <Plus size={22} color="white" />
            </Pressable>
          </View>
        </FadeIn>

        {/* Time Filter Tabs */}
        <SlideIn delay={100}>
          <SimpleTabBar
            tabs={TIME_TABS}
            activeIndex={timeFilterIndex}
            onTabChange={setTimeFilterIndex}
            style="pill"
          />
        </SlideIn>

        {/* Status Filter Chips */}
        <SlideIn delay={150}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="my-4">
            <View className="flex-row gap-2">
              {STATUS_TABS.map(({ key, label, icon: Icon }) => {
                const isActive = statusFilter === key;
                return (
                  <Pressable key={key} onPress={() => setStatusFilter(key as GoalStatus)}>
                    <MotiView animate={{ scale: isActive ? 1.02 : 1 }}>
                      <Chip
                        size="md"
                        color={isActive ? "accent" : "default"}
                      >
                        <Icon size={14} color={isActive ? "white" : foregroundColor} />
                        <Chip.Label className="ml-1">{label}</Chip.Label>
                      </Chip>
                    </MotiView>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </SlideIn>

        {/* Current Focus */}
        {currentFocus && statusFilter === "all" && timeFilterIndex === 0 && (
          <SlideIn delay={200}>
            <View className="flex-row items-center gap-2 mb-3">
              <Flame size={16} color={accentColor} />
              <Text className="text-foreground font-semibold">Current Focus</Text>
            </View>
            <Surface
              variant="tertiary"
              className="p-4 rounded-2xl mb-4"
              style={{ borderLeftWidth: 3, borderLeftColor: accentColor }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-bold text-lg">{currentFocus.title}</Text>
                  <Text className="text-muted text-sm">
                    {currentFocus.currentValue} / {currentFocus.targetValue} {currentFocus.unit}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-accent font-bold text-2xl">
                    {Math.round((currentFocus.currentValue / currentFocus.targetValue) * 100)}%
                  </Text>
                </View>
              </View>
              <View className="mt-3">
                <AnimatedProgressBar
                  progress={Math.round((currentFocus.currentValue / currentFocus.targetValue) * 100)}
                  isSurpassed={currentFocus.isSurpassed}
                />
              </View>
              <Button
                size="sm"
                className="mt-4"
                onPress={() => router.push(`/goal/update/${currentFocus.id}`)}
              >
                <Button.Label>Log Progress</Button.Label>
                <ChevronRight size={16} color="white" />
              </Button>
            </Surface>
          </SlideIn>
        )}

        {/* Goals List */}
        <SlideIn delay={250}>
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal, index) => (
              <GoalCard key={goal.id} goal={goal} index={index} />
            ))
          ) : (
            <Surface variant="secondary" className="p-8 rounded-2xl items-center my-4">
              <Target size={40} color={mutedColor} />
              <Text className="text-foreground font-semibold text-lg mt-3">No goals found</Text>
              <Text className="text-muted text-sm text-center mt-1">
                {statusFilter !== "all"
                  ? `No ${statusFilter} goals`
                  : "Create your first goal to get started"}
              </Text>
              <Button size="sm" className="mt-4" onPress={() => router.push("/goal/new")}>
                <Plus size={16} color="white" />
                <Button.Label className="ml-1">Create Goal</Button.Label>
              </Button>
            </Surface>
          )}
        </SlideIn>

        <View className="h-8" />
      </ScrollView>
    </Container>
  );
}
