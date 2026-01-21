import { MotiView } from "moti";
import { Link } from "expo-router";
import { Button, Surface, Chip, Divider, useThemeColor } from "heroui-native";
import {
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Flame,
  Award,
  Calendar,
} from "lucide-react-native";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, ScaleIn } from "@/components/animations";
import { useGoals, useGroups } from "@/hooks/use-data";

export default function Home() {
  const { goals } = useGoals();
  const { groups } = useGroups();

  const foregroundColor = useThemeColor("foreground");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const accentColor = useThemeColor("accent");

  // Stats
  const activeGoals = goals.filter((g) => !g.isCompleted).length;
  const completedGoals = goals.filter((g) => g.isCompleted).length;
  const surpassedGoals = goals.filter((g) => g.isSurpassed).length;
  const totalUpdates = goals.reduce((acc, g) => acc + g.updates.length, 0);

  // Get recent goal
  const recentGoal = goals.filter((g) => !g.isCompleted)[0];

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Container className="p-4">
      {/* Header */}
      <FadeIn>
        <View className="py-6 mb-2">
          <Text className="text-muted text-sm">{getGreeting()}</Text>
          <Text className="text-3xl font-bold text-foreground tracking-tight">
            LockedIn
          </Text>
          <Text className="text-muted text-sm mt-1">
            Stay focused. Stay accountable.
          </Text>
        </View>
      </FadeIn>

      {/* Quick Stats Banner */}
      <SlideIn delay={100}>
        <Surface variant="secondary" className="p-4 rounded-xl mb-6">
          <View className="flex-row items-center justify-around">
            <View className="items-center">
              <View className="flex-row items-center mb-1">
                <Flame size={16} color={warningColor} />
                <Text className="text-foreground font-bold text-2xl ml-1">
                  {activeGoals}
                </Text>
              </View>
              <Text className="text-muted text-xs">Active</Text>
            </View>

            <View className="w-px h-8 bg-muted/30" />

            <View className="items-center">
              <View className="flex-row items-center mb-1">
                <CheckCircle size={16} color={successColor} />
                <Text className="text-foreground font-bold text-2xl ml-1">
                  {completedGoals}
                </Text>
              </View>
              <Text className="text-muted text-xs">Completed</Text>
            </View>

            <View className="w-px h-8 bg-muted/30" />

            <View className="items-center">
              <View className="flex-row items-center mb-1">
                <TrendingUp size={16} color={accentColor} />
                <Text className="text-foreground font-bold text-2xl ml-1">
                  {surpassedGoals}
                </Text>
              </View>
              <Text className="text-muted text-xs">Surpassed</Text>
            </View>
          </View>
        </Surface>
      </SlideIn>

      {/* Recent Goal Highlight */}
      {recentGoal && (
        <SlideIn delay={200}>
          <Surface variant="tertiary" className="p-4 rounded-xl mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Target size={18} color={foregroundColor} />
                <Text className="text-foreground font-semibold ml-2">
                  Current Focus
                </Text>
              </View>
              <Chip size="sm" color="success" variant="flat">
                <Chip.Label>
                  {Math.round(
                    (recentGoal.currentValue / recentGoal.targetValue) * 100
                  )}
                  %
                </Chip.Label>
              </Chip>
            </View>

            <Text className="text-foreground font-medium text-lg mb-1">
              {recentGoal.title}
            </Text>
            <Text className="text-muted text-sm mb-3">
              {recentGoal.unit === "$"
                ? `$${recentGoal.currentValue}`
                : recentGoal.currentValue}{" "}
              of{" "}
              {recentGoal.unit === "$"
                ? `$${recentGoal.targetValue}`
                : recentGoal.targetValue}{" "}
              {recentGoal.unit !== "$" && recentGoal.unit}
            </Text>

            {/* Progress bar */}
            <View className="h-2 bg-muted/30 rounded-full overflow-hidden mb-4">
              <MotiView
                className="h-full bg-success rounded-full"
                from={{ width: "0%" }}
                animate={{
                  width: `${Math.min(
                    (recentGoal.currentValue / recentGoal.targetValue) * 100,
                    100
                  )}%`,
                }}
                transition={{ type: "timing", duration: 800, delay: 300 }}
              />
            </View>

            <Link href={`/goal/update/${recentGoal.id}`} asChild>
              <Button size="sm" variant="secondary">
                <TrendingUp size={16} color={foregroundColor} />
                <Button.Label className="ml-2">Log Progress</Button.Label>
              </Button>
            </Link>
          </Surface>
        </SlideIn>
      )}

      {/* Quick Actions */}
      <SlideIn delay={300}>
        <Text className="text-foreground font-semibold text-lg mb-3">
          Quick Actions
        </Text>
        <View className="flex-row gap-3 mb-6">
          <Link href="/goal/new" asChild className="flex-1">
            <MotiView
              className="flex-1"
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 350 }}
            >
              <Surface
                variant="secondary"
                className="p-4 rounded-xl items-center"
              >
                <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mb-2">
                  <Target size={24} color={accentColor} />
                </View>
                <Text className="text-foreground font-medium text-sm">
                  New Goal
                </Text>
              </Surface>
            </MotiView>
          </Link>

          <Link href="/group/new" asChild className="flex-1">
            <MotiView
              className="flex-1"
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 400 }}
            >
              <Surface
                variant="secondary"
                className="p-4 rounded-xl items-center"
              >
                <View className="w-12 h-12 rounded-full bg-success/20 items-center justify-center mb-2">
                  <Users size={24} color={successColor} />
                </View>
                <Text className="text-foreground font-medium text-sm">
                  New Group
                </Text>
              </Surface>
            </MotiView>
          </Link>

          <Link href="/group/join" asChild className="flex-1">
            <MotiView
              className="flex-1"
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 450 }}
            >
              <Surface
                variant="secondary"
                className="p-4 rounded-xl items-center"
              >
                <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center mb-2">
                  <Award size={24} color={warningColor} />
                </View>
                <Text className="text-foreground font-medium text-sm">
                  Join Group
                </Text>
              </Surface>
            </MotiView>
          </Link>
        </View>
      </SlideIn>

      {/* Groups Overview */}
      <SlideIn delay={400}>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-foreground font-semibold text-lg">
            Your Groups
          </Text>
          <Link href="/(drawer)/(tabs)/two" asChild>
            <Button size="sm" variant="ghost">
              <Button.Label>View All</Button.Label>
              <ArrowRight size={14} color={foregroundColor} />
            </Button>
          </Link>
        </View>

        {groups.length > 0 ? (
          <Surface variant="secondary" className="p-4 rounded-xl">
            {groups.slice(0, 2).map((group, index) => (
              <View key={group.id}>
                <Link href={`/group/${group.id}`} asChild>
                  <View className="flex-row items-center py-2">
                    <View className="w-10 h-10 rounded-full bg-accent/20 items-center justify-center mr-3">
                      <Users size={18} color={accentColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-medium">
                        {group.name}
                      </Text>
                      <Text className="text-muted text-xs">
                        {group.members.length} members
                      </Text>
                    </View>
                    <ArrowRight size={16} color={foregroundColor + "60"} />
                  </View>
                </Link>
                {index < Math.min(groups.length, 2) - 1 && (
                  <Divider className="my-2" />
                )}
              </View>
            ))}
          </Surface>
        ) : (
          <Surface variant="secondary" className="p-6 rounded-xl items-center">
            <Users size={32} color={foregroundColor + "40"} />
            <Text className="text-muted text-sm mt-2">No groups yet</Text>
          </Surface>
        )}
      </SlideIn>
    </Container>
  );
}
