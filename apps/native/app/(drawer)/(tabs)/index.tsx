import { Link } from "expo-router";
import { Plus, Target, TrendingUp, CheckCircle, BarChart3 } from "lucide-react-native";
import { Text, View, RefreshControl, ScrollView } from "react-native";
import { useState, useCallback, useMemo } from "react";
import { BarChart, PieChart } from "react-native-gifted-charts";

import { Container } from "@/components/container";
import { SlideIn, FadeIn } from "@/components/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGoals, useAnalytics } from "@/hooks/use-data";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function GoalsScreen() {
  const { goals, refreshGoals } = useGoals();
  const analytics = useAnalytics();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const accentColor = "#ff6b35";
  const foregroundColor = isDark ? "#ffffff" : "#000000";

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    refreshGoals();
    setRefreshing(false);
  }, [refreshGoals]);

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);
  const surpassedCount = goals.filter((g) => g.isSurpassed).length;

  // Chart data
  const categoryChartData = useMemo(() => {
    return analytics.categoryBreakdown.map((cat, index) => ({
      value: cat.count,
      label: cat.category.slice(0, 6),
      frontColor: ["#ff6b35", "#22c55e", "#3b82f6", "#a855f7", "#f59e0b"][index % 5],
    }));
  }, [analytics.categoryBreakdown]);

  const progressPieData = useMemo(() => {
    return [
      { value: analytics.goalsCompleted, color: "#22c55e", text: `${analytics.goalsCompleted}` },
      { value: analytics.goalsSurpassed, color: "#a855f7", text: `${analytics.goalsSurpassed}` },
      { value: activeGoals.length, color: "#ff6b35", text: `${activeGoals.length}` },
    ];
  }, [analytics, activeGoals]);

  return (
    <Container
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header Stats */}
        <FadeIn>
          <View className="p-6">
            <Text className="text-3xl font-bold text-foreground mb-1">Your Goals</Text>
            <Text className="text-muted text-base">Track your progress and stay accountable</Text>
          </View>
        </FadeIn>

        {/* Quick Stats */}
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
                    <Text className="text-xs text-muted text-center">Active</Text>
                  </View>
                </CardContent>
              </Card>

              {/* Completed Goals */}
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <View className="items-center gap-2">
                    <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center">
                      <CheckCircle size={24} color="#22c55e" />
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
                      <TrendingUp size={24} color="#a855f7" />
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

        {/* Add Goal Button */}
        <SlideIn delay={150}>
          <View className="px-6 mb-6">
            <Link href="/goal/new" asChild>
              <Button className="w-full flex-row items-center justify-center gap-2 rounded-xl py-3">
                <Plus size={20} color="white" />
                <Text className="text-white font-semibold">Create New Goal</Text>
              </Button>
            </Link>
          </View>
        </SlideIn>

        {/* Tabs Section */}
        <SlideIn delay={200}>
          <View className="px-6 mb-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="bg-card">
                <TabsTrigger value="overview">
                  <Text className="text-sm">Overview</Text>
                </TabsTrigger>
                <TabsTrigger value="charts">
                  <Text className="text-sm">Charts</Text>
                </TabsTrigger>
                <TabsTrigger value="table">
                  <Text className="text-sm">Table</Text>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                {/* Active Goals Section */}
                {activeGoals.length > 0 && (
                  <View className="mb-6 mt-4">
                    <Text className="text-lg font-bold text-foreground mb-4">Active Goals</Text>
                    <View className="gap-3">
                      {activeGoals.map((goal) => (
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
                  </View>
                )}

                {/* Completed Goals Section */}
                {completedGoals.length > 0 && (
                  <View className="mb-6">
                    <Text className="text-lg font-bold text-foreground mb-4">Completed</Text>
                    <View className="gap-3">
                      {completedGoals.map((goal) => (
                        <Card key={goal.id} className="opacity-75">
                          <CardContent className="py-4">
                            <View className="gap-3">
                              <View className="flex-row items-start justify-between">
                                <Text className="flex-1 font-semibold text-foreground text-base line-through">
                                  {goal.title}
                                </Text>
                                <Badge className="bg-green-100">
                                  <Text className="text-green-700 text-xs font-semibold">
                                    100%
                                  </Text>
                                </Badge>
                              </View>
                            </View>
                          </CardContent>
                        </Card>
                      ))}
                    </View>
                  </View>
                )}
              </TabsContent>

              {/* Charts Tab */}
              <TabsContent value="charts">
                <View className="gap-4 mt-4">
                  {/* Category Chart */}
                  {categoryChartData.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Goals by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <View className="items-center">
                          <BarChart
                            data={categoryChartData}
                            barWidth={32}
                            spacing={24}
                            noOfSections={4}
                            barBorderRadius={4}
                            frontColor={accentColor}
                            yAxisThickness={0}
                            xAxisThickness={0}
                            xAxisLabelTextStyle={{ color: foregroundColor, fontSize: 10 }}
                            hideYAxisText
                            width={250}
                            height={120}
                          />
                        </View>
                      </CardContent>
                    </Card>
                  )}

                  {/* Progress Pie Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Goal Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View className="items-center">
                        <PieChart
                          data={progressPieData}
                          donut
                          radius={70}
                          innerRadius={45}
                          centerLabelComponent={() => (
                            <View className="items-center">
                              <Text className="text-2xl font-bold text-foreground">
                                {goals.length}
                              </Text>
                              <Text className="text-xs text-muted">Total</Text>
                            </View>
                          )}
                        />
                        <View className="flex-row gap-4 mt-4">
                          <View className="flex-row items-center gap-2">
                            <View className="w-3 h-3 rounded-full bg-green-500" />
                            <Text className="text-xs text-muted">Completed</Text>
                          </View>
                          <View className="flex-row items-center gap-2">
                            <View className="w-3 h-3 rounded-full bg-purple-500" />
                            <Text className="text-xs text-muted">Surpassed</Text>
                          </View>
                          <View className="flex-row items-center gap-2">
                            <View className="w-3 h-3 rounded-full bg-orange-500" />
                            <Text className="text-xs text-muted">Active</Text>
                          </View>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              </TabsContent>

              {/* Table Tab */}
              <TabsContent value="table">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>All Goals</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead flex={2}>Goal</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {goals.map((goal, index) => (
                          <TableRow key={goal.id} isLast={index === goals.length - 1}>
                            <TableCell flex={2}>
                              <Text className="text-sm text-foreground font-medium" numberOfLines={1}>
                                {goal.title}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text className="text-sm text-foreground">
                                {Math.round((goal.currentValue / goal.targetValue) * 100)}%
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Badge className={goal.isCompleted ? "bg-green-100" : "bg-orange-100"}>
                                <Text className={`text-xs ${goal.isCompleted ? "text-green-700" : "text-orange-700"}`}>
                                  {goal.isSurpassed ? "Surpassed" : goal.isCompleted ? "Done" : "Active"}
                                </Text>
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </View>
        </SlideIn>

        {/* Empty State */}
        {goals.length === 0 && (
          <SlideIn delay={200}>
            <View className="px-6 mb-8">
              <Card>
                <CardContent className="py-12">
                  <View className="items-center gap-3">
                    <Target size={48} color={accentColor + "60"} />
                    <Text className="text-lg font-semibold text-foreground">No goals yet</Text>
                    <Text className="text-center text-muted text-sm">
                      Create your first goal and start tracking your progress
                    </Text>
                    <Link href="/goal/new" asChild>
                      <Button className="mt-4 px-6 py-2 rounded-lg flex-row items-center gap-2">
                        <Plus size={16} color="white" />
                        <Text className="text-white font-semibold">Create Goal</Text>
                      </Button>
                    </Link>
                  </View>
                </CardContent>
              </Card>
            </View>
          </SlideIn>
        )}
      </ScrollView>
    </Container>
  );
}
