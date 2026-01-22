import { Link } from "expo-router";
import { Plus, Users, UserPlus, Crown, Globe } from "lucide-react-native";
import { Text, View, RefreshControl, ScrollView } from "react-native";
import { useState, useCallback } from "react";
import { useThemeColor } from "heroui-native";
import { BarChart } from "react-native-gifted-charts";

import { Container } from "@/components/container";
import { SlideIn, FadeIn } from "@/components/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGroups } from "@/hooks/use-data";

const CURRENT_USER_ID = "user_1";

export default function GroupsScreen() {
  const { groups, refreshGroups } = useGroups();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    refreshGroups();
    setRefreshing(false);
  }, [refreshGroups]);

  const myGroups = groups.filter((g) => g.ownerId === CURRENT_USER_ID);
  const joinedGroups = groups.filter((g) => g.ownerId !== CURRENT_USER_ID);
  const totalMembers = groups.reduce((acc, g) => acc + g.members.length, 0);

  // Chart data for member distribution
  const memberChartData = groups.slice(0, 5).map((group) => ({
    value: group.members.length,
    label: group.name.slice(0, 8),
    frontColor: group.ownerId === CURRENT_USER_ID ? "#f59e0b" : "#3b82f6",
  }));

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
            <Text className="text-3xl font-bold text-foreground mb-1">Groups</Text>
            <Text className="text-muted text-base">
              Accountability groups to keep you on track
            </Text>
          </View>
        </FadeIn>

        {/* Quick Stats */}
        <SlideIn delay={100}>
          <View className="px-6 mb-6">
            <View className="flex-row gap-3">
              <Card className="flex-1">
                <CardContent className="pt-6">
                  <View className="items-center gap-2">
                    <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center">
                      <Users size={24} color="#3b82f6" />
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                      {groups.length}
                    </Text>
                    <Text className="text-xs text-muted text-center">Groups</Text>
                  </View>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardContent className="pt-6">
                  <View className="items-center gap-2">
                    <View className="w-12 h-12 rounded-xl bg-amber-100 items-center justify-center">
                      <Crown size={24} color="#f59e0b" />
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                      {myGroups.length}
                    </Text>
                    <Text className="text-xs text-muted text-center">Owned</Text>
                  </View>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardContent className="pt-6">
                  <View className="items-center gap-2">
                    <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center">
                      <Globe size={24} color="#22c55e" />
                    </View>
                    <Text className="text-2xl font-bold text-foreground">
                      {totalMembers}
                    </Text>
                    <Text className="text-xs text-muted text-center">Members</Text>
                  </View>
                </CardContent>
              </Card>
            </View>
          </View>
        </SlideIn>

        {/* Action Buttons */}
        <SlideIn delay={150}>
          <View className="px-6 mb-6 flex-row gap-3">
            <Link href="/group/new" asChild className="flex-1">
              <Button className="flex-row items-center justify-center gap-2 rounded-xl py-3">
                <Plus size={20} color="white" />
                <Text className="text-white font-semibold">Create</Text>
              </Button>
            </Link>
            <Link href="/group/join" asChild className="flex-1">
              <Button className="flex-row items-center justify-center gap-2 rounded-xl py-3 bg-muted">
                <UserPlus size={20} color="#6b7280" />
                <Text className="text-foreground font-semibold">Join</Text>
              </Button>
            </Link>
          </View>
        </SlideIn>

        {/* Tabs */}
        <SlideIn delay={200}>
          <View className="px-6 mb-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="bg-card">
                <TabsTrigger value="overview">
                  <Text className="text-sm">Overview</Text>
                </TabsTrigger>
                <TabsTrigger value="chart">
                  <Text className="text-sm">Chart</Text>
                </TabsTrigger>
                <TabsTrigger value="table">
                  <Text className="text-sm">Table</Text>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                {/* My Groups */}
                {myGroups.length > 0 && (
                  <View className="mt-4">
                    <Text className="text-lg font-bold text-foreground mb-4">My Groups</Text>
                    <View className="gap-3">
                      {myGroups.map((group) => (
                        <Card key={group.id}>
                          <CardContent className="py-4">
                            <View className="gap-2">
                              <View className="flex-row items-start justify-between">
                                <Text className="flex-1 font-semibold text-foreground text-base">
                                  {group.name}
                                </Text>
                                <Badge className="bg-amber-100">
                                  <Text className="text-amber-700 text-xs font-semibold">Owner</Text>
                                </Badge>
                              </View>
                              {group.description && (
                                <Text className="text-xs text-muted">{group.description}</Text>
                              )}
                              <View className="flex-row items-center gap-4 mt-1">
                                <Text className="text-xs text-muted">{group.members.length} members</Text>
                                {group.isPublic && (
                                  <Badge className="bg-green-100">
                                    <Text className="text-green-700 text-xs">Public</Text>
                                  </Badge>
                                )}
                              </View>
                            </View>
                          </CardContent>
                        </Card>
                      ))}
                    </View>
                  </View>
                )}

                {/* Joined Groups */}
                {joinedGroups.length > 0 && (
                  <View className="mt-6">
                    <Text className="text-lg font-bold text-foreground mb-4">Joined Groups</Text>
                    <View className="gap-3">
                      {joinedGroups.map((group) => (
                        <Card key={group.id}>
                          <CardContent className="py-4">
                            <View className="gap-2">
                              <View className="flex-row items-start justify-between">
                                <Text className="flex-1 font-semibold text-foreground text-base">
                                  {group.name}
                                </Text>
                                <Badge className="bg-blue-100">
                                  <Text className="text-blue-700 text-xs font-semibold">Member</Text>
                                </Badge>
                              </View>
                              <Text className="text-xs text-muted">{group.members.length} members</Text>
                            </View>
                          </CardContent>
                        </Card>
                      ))}
                    </View>
                  </View>
                )}

                {/* Empty State */}
                {groups.length === 0 && (
                  <Card className="mt-4">
                    <CardContent className="py-12">
                      <View className="items-center gap-3">
                        <Users size={48} color="#d1d5db" />
                        <Text className="text-lg font-semibold text-foreground">No groups yet</Text>
                        <Text className="text-center text-muted text-sm">
                          Create or join a group to stay accountable with others
                        </Text>
                      </View>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Chart Tab */}
              <TabsContent value="chart">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Members per Group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {memberChartData.length > 0 ? (
                      <View className="items-center">
                        <BarChart
                          data={memberChartData}
                          width={280}
                          height={180}
                          barWidth={40}
                          spacing={20}
                          noOfSections={4}
                          barBorderRadius={4}
                          yAxisColor={mutedColor}
                          xAxisColor={mutedColor}
                          yAxisTextStyle={{ color: mutedColor, fontSize: 10 }}
                          xAxisLabelTextStyle={{ color: mutedColor, fontSize: 10 }}
                          hideRules
                        />
                        <View className="flex-row gap-4 mt-4">
                          <View className="flex-row items-center gap-2">
                            <View className="w-3 h-3 rounded-full bg-amber-500" />
                            <Text className="text-xs text-muted">Owned</Text>
                          </View>
                          <View className="flex-row items-center gap-2">
                            <View className="w-3 h-3 rounded-full bg-blue-500" />
                            <Text className="text-xs text-muted">Joined</Text>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View className="items-center py-8">
                        <Text className="text-muted">No data to display</Text>
                      </View>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Table Tab */}
              <TabsContent value="table">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>All Groups</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead flex={2}>Name</TableHead>
                          <TableHead>Members</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {groups.length === 0 ? (
                          <TableRow isLast>
                            <TableCell flex={4}>
                              <Text className="text-muted text-center py-4">No groups yet</Text>
                            </TableCell>
                          </TableRow>
                        ) : (
                          groups.map((group, index) => {
                            const isOwner = group.ownerId === CURRENT_USER_ID;
                            return (
                              <TableRow key={group.id} isLast={index === groups.length - 1}>
                                <TableCell flex={2}>
                                  <Text className="text-sm text-foreground font-medium" numberOfLines={1}>
                                    {group.name}
                                  </Text>
                                </TableCell>
                                <TableCell>
                                  <Text className="text-sm text-foreground">{group.members.length}</Text>
                                </TableCell>
                                <TableCell>
                                  <Badge className={isOwner ? "bg-amber-100" : "bg-blue-100"}>
                                    <Text
                                      className={`text-xs font-semibold ${
                                        isOwner ? "text-amber-700" : "text-blue-700"
                                      }`}
                                    >
                                      {isOwner ? "Owner" : "Member"}
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
              </TabsContent>
            </Tabs>
          </View>
        </SlideIn>
      </ScrollView>
    </Container>
  );
}