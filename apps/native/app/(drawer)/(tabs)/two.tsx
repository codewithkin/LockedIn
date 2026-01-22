import { Link } from "expo-router";
import { Plus, Users, UserPlus, Crown, Globe } from "lucide-react-native";
import { Text, View, RefreshControl, ScrollView } from "react-native";
import { useState, useCallback } from "react";

import { Container } from "@/components/container";
import { GroupCard } from "@/components/group-card";
import { SlideIn, FadeIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGroups } from "@/hooks/use-data";

export default function GroupsScreen() {
  const { groups, refreshGroups } = useGroups();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    refreshGroups();
    setRefreshing(false);
  }, [refreshGroups]);

  const myGroups = groups.filter((g) => g.ownerId === "user_1");
  const joinedGroups = groups.filter((g) => g.ownerId !== "user_1");
  const totalMembers = groups.reduce((acc, g) => acc + g.members.length, 0);

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
              {/* Total Groups */}
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

              {/* Owned Groups */}
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

              {/* Total Members */}
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

        {/* My Groups */}
        {myGroups.length > 0 && (
          <SlideIn delay={200}>
            <View className="px-6 mb-8">
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
                        <Text className="text-xs text-muted">{group.members.length} members</Text>
                      </View>
                    </CardContent>
                  </Card>
                ))}
              </View>
            </View>
          </SlideIn>
        )}

        {/* Joined Groups */}
        {joinedGroups.length > 0 && (
          <SlideIn delay={250}>
            <View className="px-6 mb-8">
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
          </SlideIn>
        )}

        {/* Empty State */}
        {groups.length === 0 && (
          <SlideIn delay={200}>
            <View className="px-6 mb-8">
              <Card>
                <CardContent className="py-12">
                  <View className="items-center gap-3">
                    <Users size={48} color="#d1d5db" />
                    <Text className="text-lg font-semibold text-foreground">No groups yet</Text>
                    <Text className="text-center text-muted text-sm">
                      Create or join a group to stay accountable with others
                    </Text>
                    <View className="flex-row gap-3 mt-4">
                      <Link href="/group/new" asChild>
                        <Button className="px-6 py-2 rounded-lg flex-row items-center gap-2">
                          <Plus size={16} color="white" />
                          <Text className="text-white font-semibold">Create</Text>
                        </Button>
                      </Link>
                      <Link href="/group/join" asChild>
                        <Button className="px-6 py-2 rounded-lg flex-row items-center gap-2 bg-muted">
                          <UserPlus size={16} color="#6b7280" />
                          <Text className="text-foreground font-semibold">Join</Text>
                        </Button>
                      </Link>
                    </View>
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
