import { MotiView } from "moti";
import { Link } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Plus, Users, UserPlus, Crown, Globe } from "lucide-react-native";
import { Text, View, RefreshControl } from "react-native";
import { useState, useCallback } from "react";

import { Container } from "@/components/container";
import { GroupCard } from "@/components/group-card";
import { SlideIn, FadeIn } from "@/components/animations";
import { useGroups } from "@/hooks/use-data";

export default function GroupsScreen() {
  const { groups, refreshGroups } = useGroups();
  const [refreshing, setRefreshing] = useState(false);

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");

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
      className="p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <FadeIn>
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-1">Groups</Text>
          <Text className="text-muted text-sm">
            Accountability groups to keep you on track
          </Text>
        </View>
      </FadeIn>

      {/* Quick Stats */}
      <SlideIn delay={100}>
        <View className="flex-row mb-6 gap-3">
          <Surface variant="secondary" className="flex-1 p-4 rounded-xl items-center">
            <View className="w-10 h-10 rounded-full bg-accent/20 items-center justify-center mb-2">
              <Users size={20} color={accentColor} />
            </View>
            <Text className="text-foreground font-bold text-xl">{groups.length}</Text>
            <Text className="text-muted text-xs">Groups</Text>
          </Surface>

          <Surface variant="secondary" className="flex-1 p-4 rounded-xl items-center">
            <View className="w-10 h-10 rounded-full bg-warning/20 items-center justify-center mb-2">
              <Crown size={20} color="#f59e0b" />
            </View>
            <Text className="text-foreground font-bold text-xl">{myGroups.length}</Text>
            <Text className="text-muted text-xs">Owned</Text>
          </Surface>

          <Surface variant="secondary" className="flex-1 p-4 rounded-xl items-center">
            <View className="w-10 h-10 rounded-full bg-success/20 items-center justify-center mb-2">
              <Globe size={20} color={successColor} />
            </View>
            <Text className="text-foreground font-bold text-xl">{totalMembers}</Text>
            <Text className="text-muted text-xs">Members</Text>
          </Surface>
        </View>
      </SlideIn>

      {/* Action Buttons */}
      <SlideIn delay={150}>
        <View className="flex-row gap-3 mb-6">
          <Link href="/group/new" asChild className="flex-1">
            <Button size="lg">
              <Plus size={18} color="white" />
              <Button.Label className="ml-2">Create Group</Button.Label>
            </Button>
          </Link>
          <Link href="/group/join" asChild className="flex-1">
            <Button size="lg" variant="secondary">
              <UserPlus size={18} color={foregroundColor} />
              <Button.Label className="ml-2">Join Group</Button.Label>
            </Button>
          </Link>
        </View>
      </SlideIn>

      {/* My Groups */}
      {myGroups.length > 0 && (
        <View className="mb-6">
          <Text className="text-foreground font-semibold text-lg mb-3">My Groups</Text>
          {myGroups.map((group, index) => (
            <GroupCard key={group.id} group={group} index={index} />
          ))}
        </View>
      )}

      {/* Joined Groups */}
      {joinedGroups.length > 0 && (
        <View className="mb-6">
          <Text className="text-foreground font-semibold text-lg mb-3">Joined Groups</Text>
          {joinedGroups.map((group, index) => (
            <GroupCard key={group.id} group={group} index={index} />
          ))}
        </View>
      )}

      {/* Empty State */}
      {groups.length === 0 && (
        <SlideIn delay={200}>
          <Surface variant="secondary" className="p-8 rounded-xl items-center">
            <View className="w-16 h-16 rounded-full bg-muted/20 items-center justify-center mb-4">
              <Users size={32} color={foregroundColor} />
            </View>
            <Text className="text-foreground font-semibold text-lg mb-2">No groups yet</Text>
            <Text className="text-muted text-sm text-center mb-4">
              Create or join a group to stay accountable with others
            </Text>
            <View className="flex-row gap-3">
              <Link href="/group/new" asChild>
                <Button size="sm">
                  <Plus size={16} color="white" />
                  <Button.Label className="ml-1">Create</Button.Label>
                </Button>
              </Link>
              <Link href="/group/join" asChild>
                <Button size="sm" variant="secondary">
                  <UserPlus size={16} color={foregroundColor} />
                  <Button.Label className="ml-1">Join</Button.Label>
                </Button>
              </Link>
            </View>
          </Surface>
        </SlideIn>
      )}
    </Container>
  );
}
