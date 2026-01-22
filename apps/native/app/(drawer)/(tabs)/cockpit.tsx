import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useThemeColor } from "heroui-native";
import { Target, Zap, TrendingUp, BarChart3 } from "lucide-react-native";
import { BarChart, PieChart, LineChart } from "react-native-gifted-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { useGoals, useAnalytics } from "@/hooks/use-data";
import { UserMenu } from "@/components/user-menu";

export default function CockpitScreen() {
  const { goals } = useGoals();
  const { analytics } = useAnalytics();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const backgroundColor = useThemeColor("background");
  const mutedColor = useThemeColor("muted");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    setRefreshing(false);
  }, []);

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);
  const surpassedCount = goals.filter((g) => g.isSurpassed).length;

  // Chart data
  const weeklyBarData = analytics.weeklyProgress.map((item) => ({
    value: item.value,
    label: item.day,
    frontColor: accentColor,
  }));

  const pieData = analytics.categoryBreakdown.map((item) => ({
    value: item.count,
    color: item.color,
    text: item.category,
  }));

  const lineData = analytics.monthlyTrends.map((item) => ({
    value: item.completed,
    label: item.month,
  }));

  return (
    <Container
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header with User Menu */}
        <FadeIn>
          <View className="p-6 flex-row items-start justify-between">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-foreground mb-2">Welcome Back</Text>
              <Text className="text-muted text-base">Your progress dashboard</Text>
            </View>
            <UserMenu />
          </View>
        </FadeIn>

        {/* Tabs */}
        <SlideIn delay={50}>
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
                  <Text className="text-sm">Details</Text>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                {/* Quick Stats Grid */}
                <View className="mt-4">
                  <View className="flex-row gap-3">
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

                {/* Progress Summary */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Average Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View className="gap-3">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-muted text-sm">Overall completion</Text>
                        <Badge className="bg-accent/10">
                          <Text className="text-accent font-semibold">{analytics.totalProgress}%</Text>
                        </Badge>
                      </View>
                      <View className="h-3 bg-muted rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${analytics.totalProgress}%`,
                            backgroundColor: accentColor,
                          }}
                        />
                      </View>
                    </View>
                  </CardContent>
                </Card>

                {/* Active Goals Preview */}
                {activeGoals.length > 0 && (
                  <View className="mt-6">
                    <Text className="text-lg font-bold text-foreground mb-4">Active Goals</Text>
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
                  </View>
                )}

                {activeGoals.length === 0 && (
                  <Card className="mt-4">
                    <CardContent className="py-8">
                      <View className="items-center gap-3">
                        <Target size={40} color={accentColor + "60"} />
                        <Text className="text-center text-muted">
                          No active goals. Create one to get started!
                        </Text>
                      </View>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Charts Tab */}
              <TabsContent value="charts">
                {/* Weekly Activity Bar Chart */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Weekly Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View className="items-center">
                      <BarChart
                        data={weeklyBarData}
                        width={280}
                        height={150}
                        barWidth={28}
                        spacing={12}
                        noOfSections={4}
                        barBorderRadius={4}
                        frontColor={accentColor}
                        yAxisColor={mutedColor}
                        xAxisColor={mutedColor}
                        yAxisTextStyle={{ color: mutedColor, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: mutedColor, fontSize: 10 }}
                        hideRules
                      />
                    </View>
                  </CardContent>
                </Card>

                {/* Category Pie Chart */}
                {pieData.length > 0 && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Goals by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View className="flex-row items-center justify-between">
                        <PieChart
                          data={pieData}
                          donut
                          radius={70}
                          innerRadius={45}
                          centerLabelComponent={() => (
                            <View className="items-center">
                              <Text className="text-2xl font-bold text-foreground">{goals.length}</Text>
                              <Text className="text-xs text-muted">Total</Text>
                            </View>
                          )}
                        />
                        <View className="flex-1 ml-6 gap-2">
                          {analytics.categoryBreakdown.map((item) => (
                            <View key={item.category} className="flex-row items-center gap-2">
                              <View
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <Text className="text-sm text-foreground capitalize flex-1">
                                {item.category}
                              </Text>
                              <Text className="text-sm text-muted">{item.count}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                )}

                {/* Monthly Trends Line Chart */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <View className="items-center">
                      <LineChart
                        data={lineData}
                        width={280}
                        height={150}
                        spacing={70}
                        color={accentColor}
                        thickness={3}
                        dataPointsColor={accentColor}
                        yAxisColor={mutedColor}
                        xAxisColor={mutedColor}
                        yAxisTextStyle={{ color: mutedColor, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: mutedColor, fontSize: 10 }}
                        hideRules
                        curved
                      />
                    </View>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="table">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Goals Summary</CardTitle>
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
                        {goals.length === 0 ? (
                          <TableRow isLast>
                            <TableCell flex={4}>
                              <Text className="text-muted text-center py-4">No goals yet</Text>
                            </TableCell>
                          </TableRow>
                        ) : (
                          goals.map((goal, index) => {
                            const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
                            const status = goal.isSurpassed
                              ? "Surpassed"
                              : goal.isCompleted
                              ? "Completed"
                              : "Active";
                            const statusColor = goal.isSurpassed
                              ? "bg-purple-100"
                              : goal.isCompleted
                              ? "bg-green-100"
                              : "bg-orange-100";
                            const statusTextColor = goal.isSurpassed
                              ? "text-purple-700"
                              : goal.isCompleted
                              ? "text-green-700"
                              : "text-orange-700";

                            return (
                              <TableRow key={goal.id} isLast={index === goals.length - 1}>
                                <TableCell flex={2}>
                                  <Text className="text-sm text-foreground font-medium" numberOfLines={1}>
                                    {goal.title}
                                  </Text>
                                </TableCell>
                                <TableCell>
                                  <Text className="text-sm text-foreground">{progress}%</Text>
                                </TableCell>
                                <TableCell>
                                  <Badge className={statusColor}>
                                    <Text className={`text-xs font-semibold ${statusTextColor}`}>
                                      {status}
                                    </Text>
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Category Stats */}
                <Card className="mt-4 mb-8">
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead flex={2}>Category</TableHead>
                          <TableHead>Count</TableHead>
                          <TableHead>% of Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analytics.categoryBreakdown.length === 0 ? (
                          <TableRow isLast>
                            <TableCell flex={4}>
                              <Text className="text-muted text-center py-4">No data</Text>
                            </TableCell>
                          </TableRow>
                        ) : (
                          analytics.categoryBreakdown.map((item, index) => (
                            <TableRow
                              key={item.category}
                              isLast={index === analytics.categoryBreakdown.length - 1}
                            >
                              <TableCell flex={2}>
                                <View className="flex-row items-center gap-2">
                                  <View
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <Text className="text-sm text-foreground capitalize">
                                    {item.category}
                                  </Text>
                                </View>
                              </TableCell>
                              <TableCell>
                                <Text className="text-sm text-foreground">{item.count}</Text>
                              </TableCell>
                              <TableCell>
                                <Text className="text-sm text-foreground">
                                  {goals.length > 0
                                    ? Math.round((item.count / goals.length) * 100)
                                    : 0}
                                  %
                                </Text>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </View>
        </SlideIn>
      </ScrollView>
    </Container>
  );
}
