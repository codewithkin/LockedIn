import { MotiView } from "moti";
import { Stack, useLocalSearchParams, router, Link } from "expo-router";
import { Button, Surface, Chip, Divider, useThemeColor } from "heroui-native";
import {
  Users,
  Crown,
  UserPlus,
  Settings,
  Copy,
  LogOut,
  Target,
  ChevronRight,
  Globe,
  Lock,
  Medal,
} from "lucide-react-native";
import { Text, View, Alert, Pressable, Share, ScrollView } from "react-native";
import { useMemo, useState, useEffect } from "react";
import * as Clipboard from "expo-clipboard";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { Leaderboard } from "@/components/leaderboard";
import { useGroups, useGoals } from "@/hooks/use-data";
import { discoverApi } from "@/lib/api";
import type { LeaderboardUser } from "@/lib/api";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { groups, leaveGroup } = useGroups();
  const { goals } = useGoals();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  const foregroundColor = useThemeColor("foreground");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const dangerColor = useThemeColor("danger");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  const group = useMemo(() => groups.find((g) => g.id === id), [groups, id]);
  const groupGoals = useMemo(
    () => goals.filter((g) => g.groupId === id),
    [goals, id]
  );

  // Fetch group-specific leaderboard
  useEffect(() => {
    if (!id) return;

    const fetchLeaderboard = async () => {
      try {
        setIsLoadingLeaderboard(true);
        const response = await discoverApi.getGroupLeaderboard(id, 10);
        setLeaderboard(response.leaderboard || []);
      } catch (error) {
        console.error("Failed to fetch group leaderboard:", error);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [id]);

  const currentUserId = "user_1";

  if (!group) {
    return (
      <>
        <Stack.Screen options={{ title: "Group Not Found" }} />
        <Container className="p-4 items-center justify-center">
          <Text className="text-foreground text-lg">Group not found</Text>
          <Button onPress={() => router.back()} className="mt-4">
            <Button.Label>Go Back</Button.Label>
          </Button>
        </Container>
      </>
    );
  }

  const isOwner = group.ownerId === currentUserId;
  const currentMember = group.members.find((m) => m.userId === currentUserId);

  const handleCopyInviteCode = async () => {
    await Clipboard.setStringAsync(group.inviteCode);
    Alert.alert("Copied!", "Invite code copied to clipboard");
  };

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: `Join my group "${group.name}" on LockedIn! Use invite code: ${group.inviteCode}`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      "Leave Group",
      `Are you sure you want to leave "${group.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            await leaveGroup(group.id);
            router.back();
          },
        },
      ]
    );
  };

  const getMemberInitials = (userId: string) => {
    // In a real app, this would fetch user data
    const names: Record<string, string> = {
      user_1: "You",
      user_2: "Alex",
      user_3: "Sam",
    };
    return names[userId] || userId.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: group.name,
          headerRight: () =>
            isOwner ? (
              <Pressable className="mr-2">
                <Settings size={20} color={foregroundColor} />
              </Pressable>
            ) : null,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <Container className="p-4">
        {/* Group Header */}
        <FadeIn>
          <Surface variant="secondary" className="p-5 rounded-xl mb-4">
            <View className="items-center mb-4">
              <View className="w-20 h-20 rounded-full bg-accent/20 items-center justify-center mb-3">
                <Users size={40} color={accentColor} />
              </View>
              <View className="flex-row items-center">
                <Text className="text-foreground font-bold text-xl">
                  {group.name}
                </Text>
                {isOwner && (
                  <Crown size={18} color={warningColor} className="ml-2" />
                )}
              </View>
              {group.description && (
                <Text className="text-muted text-sm text-center mt-1">
                  {group.description}
                </Text>
              )}
            </View>

            <View className="flex-row justify-center gap-3 mb-4">
              <Chip
                size="sm"
                color={group.isPublic ? "success" : "default"}
              >
                {group.isPublic ? (
                  <Globe size={12} color={foregroundColor} />
                ) : (
                  <Lock size={12} color={foregroundColor} />
                )}
                <Chip.Label className="ml-1">
                  {group.isPublic ? "Public" : "Private"}
                </Chip.Label>
              </Chip>
              <Chip size="sm">
                <Users size={12} color={foregroundColor} />
                <Chip.Label className="ml-1">
                  {group.members.length} members
                </Chip.Label>
              </Chip>
            </View>

            {/* Invite Code */}
            <Surface variant="tertiary" className="p-3 rounded-lg">
              <Text className="text-muted text-xs text-center mb-2">
                Invite Code
              </Text>
              <View className="flex-row items-center justify-center">
                <Text className="text-foreground font-mono font-bold text-lg tracking-widest mr-3">
                  {group.inviteCode}
                </Text>
                <Pressable
                  onPress={handleCopyInviteCode}
                  className="p-2 rounded-lg bg-accent/20"
                >
                  <Copy size={16} color={accentColor} />
                </Pressable>
              </View>
              <Pressable onPress={handleShareInvite} className="mt-3">
                <Text className="text-accent text-sm text-center font-medium">
                  Share Invite Link
                </Text>
              </Pressable>
            </Surface>
          </Surface>
        </FadeIn>

        {/* Group Leaderboard */}
        <SlideIn delay={75}>
          <Leaderboard
            users={leaderboard}
            title="Group Members Ranking"
            isLoading={isLoadingLeaderboard}
            entityType="group"
          />
        </SlideIn>

        {/* Members Section */}
        <SlideIn delay={100}>
          <Text className="text-foreground font-semibold text-lg mb-3">
            Members ({group.members.length})
          </Text>
          <Surface variant="secondary" className="rounded-xl mb-6 overflow-hidden">
            {group.members.map((member, index) => (
              <View key={member.id}>
                <View className="flex-row items-center p-4">
                  <View className="w-10 h-10 rounded-full bg-muted/30 items-center justify-center mr-3">
                    <Text className="text-foreground font-medium text-sm">
                      {getMemberInitials(member.userId)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-foreground font-medium">
                        {getMemberInitials(member.userId)}
                      </Text>
                      {member.role === "admin" && (
                        <Crown size={14} color={warningColor} className="ml-1" />
                      )}
                      {member.userId === currentUserId && (
                        <Text className="text-muted text-xs ml-2">(You)</Text>
                      )}
                    </View>
                    <Text className="text-muted text-xs capitalize">
                      {member.role}
                    </Text>
                  </View>
                </View>
                {index < group.members.length - 1 && <Divider />}
              </View>
            ))}
          </Surface>
        </SlideIn>

        {/* Group Goals */}
        <SlideIn delay={200}>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground font-semibold text-lg">
              Group Goals ({groupGoals.length})
            </Text>
          </View>

          {groupGoals.length > 0 ? (
            groupGoals.map((goal, index) => (
              <Link key={goal.id} href={`/goal/${goal.id}`} asChild>
                <Pressable>
                  <Surface
                    variant="secondary"
                    className="p-4 rounded-xl mb-3 flex-row items-center"
                  >
                    <Target size={18} color={foregroundColor} />
                    <View className="flex-1 ml-3">
                      <Text className="text-foreground font-medium">
                        {goal.title}
                      </Text>
                      <Text className="text-muted text-xs">
                        {Math.round(
                          (goal.currentValue / goal.targetValue) * 100
                        )}
                        % complete
                      </Text>
                    </View>
                    <ChevronRight size={16} color={mutedColor} />
                  </Surface>
                </Pressable>
              </Link>
            ))
          ) : (
            <Surface
              variant="secondary"
              className="p-6 rounded-xl items-center"
            >
              <Target size={32} color={mutedColor} />
              <Text className="text-muted text-sm mt-2">
                No group goals yet
              </Text>
            </Surface>
          )}
        </SlideIn>

        {/* Leave Group Button */}
        {!isOwner && (
          <SlideIn delay={300}>
            <Button
              size="lg"
              variant="secondary"
              onPress={handleLeaveGroup}
              className="mt-4"
            >
              <LogOut size={18} color={dangerColor} />
              <Button.Label className="ml-2 text-danger">
                Leave Group
              </Button.Label>
            </Button>
          </SlideIn>
        )}
        </Container>
      </ScrollView>
    </>
  );
}
