import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback, useEffect } from "react";
import { useThemeColor } from "heroui-native";
import { Target, Zap, Users, TrendingUp } from "lucide-react-native";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { useGoals } from "@/hooks/use-data";

export default function CockpitScreen() {
  const { goals } = useGoals();
  const [refreshing, setRefreshing] = useState(false);
  
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const backgroundColor = useThemeColor("background");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    setRefreshing(false);
  }, []);

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);
  const surpassedCount = goals.filter((g) => g.isSurpassed).length;

  return (
    <Container
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <FadeIn>
          <View className="p-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Welcome Back</Text>
            <Text className="text-muted text-base">Your progress dashboard</Text>
          </View>
        </FadeIn>

        {/* Quick Stats Grid */}
        <SlideIn delay={100}>
          <View className="px-6 mb-6">
            <View className="flex-row gap-3">
              {/* Active Goals */}
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <View className="items-center gap-2">
                    <View className="w-12 h-12 rounded-xl bg-orange-100 items-center justify-center">
                      <Target size={24} color="#ea580c" />
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                      {activeGoals.length}
                    </Text>
                    <Text className="text-xs text-muted text-center">Active Goals</Text>
                  </View>
                </CardContent>
              </Card>

              {/* Completed Goals */}
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <View className="items-center gap-2">
                    <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center">
                      <TrendingUp size={24} color="#22c55e" />
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                      {completedGoals.length}
                    </Text>
                    <Text className="text-xs text-muted text-center">Completed</Text>
                  </View>
                </CardContent>
              </Card>

              {/* Surpassed */}
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <View className="items-center gap-2">
                    <View className="w-12 h-12 rounded-xl bg-purple-100 items-center justify-center">
                      <Zap size={24} color="#a855f7" />
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                      {surpassedCount}
                    </Text>
                    <Text className="text-xs text-muted text-center">Surpassed</Text>
                  </View>
                </CardContent>
              </Card>
            </View>
          </View>
        </SlideIn>

        {/* Active Goals Section */}
        <SlideIn delay={200}>
          <View className="px-6 mb-8">
            <Text className="text-lg font-bold text-foreground mb-4">Active Goals</Text>
            {activeGoals.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <View className="items-center gap-3">
                    <Target size={40} color={accentColor + "60"} />
                    <Text className="text-center text-muted">
                      No active goals. Create one to get started!
                    </Text>
                  </View>
                </CardContent>
              </Card>
            ) : (
              <View className="gap-3">
                {activeGoals.slice(0, 3).map((goal) => (
                  <Card key={goal.id}>
                    <CardContent className="py-4">
                      <View className="gap-3">
                        <View className="flex-row items-start justify-between">
                          <Text className="flex-1 font-semibold text-foreground text-base">
                            {goal.title}
                          </Text>
                          <Badge className="bg-orange-100">
                            <Text className="text-orange-700 text-xs font-semibold">
                              {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                            </Text>
                          </Badge>
                        </View>
                        <View className="h-2 bg-muted rounded-full overflow-hidden">
                          <View
                            className="h-full bg-orange-500"
                            style={{
                              width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%`,
                            }}
                          />
                        </View>
                        <Text className="text-xs text-muted">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </Text>
                      </View>
                    </CardContent>
                  </Card>
                ))}
              </View>
            )}
          </View>
        </SlideIn>
      </ScrollView>
    </Container>
  );
}
