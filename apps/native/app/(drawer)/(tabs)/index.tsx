import { MotiView } from "moti";
import { Link } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Plus, Target, TrendingUp, CheckCircle } from "lucide-react-native";
import { Text, View, RefreshControl } from "react-native";
import { useState, useCallback } from "react";

import { Container } from "@/components/container";
import { GoalCard } from "@/components/goal-card";
import { SlideIn, FadeIn } from "@/components/animations";
import { useGoals } from "@/hooks/use-data";

export default function GoalsScreen() {
  const { goals, refreshGoals } = useGoals();
  const [refreshing, setRefreshing] = useState(false);

  const foregroundColor = useThemeColor("foreground");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    refreshGoals();
    setRefreshing(false);
  }, [refreshGoals]);

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);
  const surpassedCount = goals.filter((g) => g.isSurpassed).length;

  return (
    <Container
      className="p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Stats */}
      <FadeIn>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-1">Your Goals</Text>
          <Text className="text-muted text-sm">Track your progress and stay accountable</Text>
        </View>
      </FadeIn>

      {/* Quick Stats */}
      <SlideIn delay={100}>
        <View className="flex-row mb-6 gap-3">
          <Surface variant="secondary" className="flex-1 p-4 rounded-xl items-center">
            <View className="w-10 h-10 rounded-full bg-accent/20 items-center justify-center mb-2">
              <Target size={20} color={foregroundColor} />
            </View>
            <Text className="text-foreground font-bold text-xl">{activeGoals.length}</Text>
            <Text className="text-muted text-xs">Active</Text>
          </Surface>

          <Surface variant="secondary" className="flex-1 p-4 rounded-xl items-center">
            <View className="w-10 h-10 rounded-full bg-success/20 items-center justify-center mb-2">
              <CheckCircle size={20} color={successColor} />
            </View>
            <Text className="text-foreground font-bold text-xl">{completedGoals.length}</Text>
            <Text className="text-muted text-xs">Completed</Text>
          </Surface>

          <Surface variant="secondary" className="flex-1 p-4 rounded-xl items-center">
            <View className="w-10 h-10 rounded-full bg-warning/20 items-center justify-center mb-2">
              <TrendingUp size={20} color={warningColor} />
            </View>
            <Text className="text-foreground font-bold text-xl">{surpassedCount}</Text>
            <Text className="text-muted text-xs">Surpassed</Text>
          </Surface>
        </View>
      </SlideIn>

      {/* Add Goal Button */}
      <SlideIn delay={150}>
        <Link href="/goal/new" asChild>
          <Button className="mb-6" size="lg">
            <Plus size={18} color="white" />
            <Button.Label className="ml-2">Create New Goal</Button.Label>
          </Button>
        </Link>
      </SlideIn>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <View className="mb-6">
          <Text className="text-foreground font-semibold text-lg mb-3">Active Goals</Text>
          {activeGoals.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} index={index} />
          ))}
        </View>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <View className="mb-6">
          <Text className="text-foreground font-semibold text-lg mb-3">Completed</Text>
          {completedGoals.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} index={index} />
          ))}
        </View>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <SlideIn delay={200}>
          <Surface variant="secondary" className="p-8 rounded-xl items-center">
            <View className="w-16 h-16 rounded-full bg-muted/20 items-center justify-center mb-4">
              <Target size={32} color={foregroundColor} />
            </View>
            <Text className="text-foreground font-semibold text-lg mb-2">No goals yet</Text>
            <Text className="text-muted text-sm text-center mb-4">
              Create your first goal and start tracking your progress
            </Text>
            <Link href="/goal/new" asChild>
              <Button size="sm">
                <Plus size={16} color="white" />
                <Button.Label className="ml-1">Create Goal</Button.Label>
              </Button>
            </Link>
          </Surface>
        </SlideIn>
      )}
    </Container>
  );
}
