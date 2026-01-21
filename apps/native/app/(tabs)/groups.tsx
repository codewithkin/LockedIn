import { MotiView } from "moti";
import { router } from "expo-router";
import { Button, Surface, Chip, useThemeColor } from "heroui-native";
import {
  Users,
  Plus,
  Globe,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ChevronRight,
  Search,
  X,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput } from "react-native";
import { useState, useMemo } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { SimpleTabBar } from "@/components/tabs";
import { useGroups } from "@/hooks/use-data";

type GroupFilter = "my" | "public" | "hidden";

const TABS = ["My Groups", "Discover", "Hidden"];

function GroupCard({
  group,
  index = 0,
  showJoinButton = false,
  showHideButton = false,
  onJoin,
  onHide,
  onUnhide,
}: {
  group: any;
  index?: number;
  showJoinButton?: boolean;
  showHideButton?: boolean;
  onJoin?: () => void;
  onHide?: () => void;
  onUnhide?: () => void;
}) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const mutedColor = useThemeColor("muted");

  const memberCount = group.members?.length || 0;
  const goalCount = group._count?.goals || group.goals?.length || 0;

  return (
    <SlideIn delay={index * 50}>
      <Pressable onPress={() => router.push(`/group/${group.id}`)}>
        {({ pressed }) => (
          <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: "timing", duration: 100 }}>
            <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
              <View className="flex-row items-start">
                {/* Avatar */}
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: accentColor + "20" }}
                >
                  <Users size={26} color={accentColor} />
                </View>

                {/* Info */}
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-foreground font-semibold text-base" numberOfLines={1}>
                      {group.name}
                    </Text>
                    {group.isPublic ? (
                      <Globe size={14} color={successColor} />
                    ) : (
                      <Lock size={14} color={mutedColor} />
                    )}
                  </View>
                  {group.description && (
                    <Text className="text-muted text-xs mt-0.5" numberOfLines={2}>
                      {group.description}
                    </Text>
                  )}
                  <View className="flex-row items-center gap-4 mt-2">
                    <Text className="text-muted text-xs">
                      {memberCount} member{memberCount !== 1 ? "s" : ""}
                    </Text>
                    <Text className="text-muted text-xs">
                      {goalCount} goal{goalCount !== 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View className="ml-2">
                  {showJoinButton && (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        onJoin?.();
                      }}
                    >
                      <View
                        className="px-3 py-2 rounded-lg flex-row items-center"
                        style={{ backgroundColor: accentColor }}
                      >
                        <UserPlus size={14} color="white" />
                        <Text className="text-white text-xs font-medium ml-1">Join</Text>
                      </View>
                    </Pressable>
                  )}
                  {showHideButton && (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        onHide?.();
                      }}
                    >
                      <View className="p-2 rounded-lg bg-muted/20">
                        <EyeOff size={16} color={mutedColor} />
                      </View>
                    </Pressable>
                  )}
                  {onUnhide && (
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        onUnhide?.();
                      }}
                    >
                      <View className="p-2 rounded-lg bg-muted/20">
                        <Eye size={16} color={accentColor} />
                      </View>
                    </Pressable>
                  )}
                </View>
              </View>
            </Surface>
          </MotiView>
        )}
      </Pressable>
    </SlideIn>
  );
}

export default function GroupsScreen() {
  const { groups, isLoading, joinGroup } = useGroups();

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");
  const backgroundColor = useThemeColor("background");

  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [hiddenGroupIds, setHiddenGroupIds] = useState<string[]>([]);

  // Mock public groups for discover
  const publicGroups = useMemo(() => [
    {
      id: "public_1",
      name: "Fitness Warriors",
      description: "A community dedicated to achieving fitness goals together",
      isPublic: true,
      members: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }],
      _count: { goals: 12 },
    },
    {
      id: "public_2",
      name: "Finance Masters",
      description: "Track savings goals and build wealth together",
      isPublic: true,
      members: [{ id: "1" }, { id: "2" }, { id: "3" }],
      _count: { goals: 8 },
    },
    {
      id: "public_3",
      name: "Book Club 2026",
      description: "Read more books and share insights",
      isPublic: true,
      members: [{ id: "1" }, { id: "2" }],
      _count: { goals: 15 },
    },
  ], []);

  // Filter groups based on tab
  const displayedGroups = useMemo(() => {
    if (tabIndex === 0) {
      // My groups
      return groups.filter((g) => !hiddenGroupIds.includes(g.id));
    } else if (tabIndex === 1) {
      // Discover (public groups)
      let filtered = publicGroups.filter((g) => !hiddenGroupIds.includes(g.id));
      if (searchQuery) {
        filtered = filtered.filter(
          (g) =>
            g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return filtered;
    } else {
      // Hidden
      return [...groups, ...publicGroups].filter((g) => hiddenGroupIds.includes(g.id));
    }
  }, [groups, publicGroups, tabIndex, searchQuery, hiddenGroupIds]);

  const handleHideGroup = (groupId: string) => {
    setHiddenGroupIds((prev) => [...prev, groupId]);
  };

  const handleUnhideGroup = (groupId: string) => {
    setHiddenGroupIds((prev) => prev.filter((id) => id !== groupId));
  };

  const handleJoinGroup = async (group: any) => {
    if (group.inviteCode) {
      await joinGroup(group.inviteCode);
    }
  };

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Header */}
        <FadeIn>
          <View className="py-6 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-foreground">Groups</Text>
              <Text className="text-muted text-sm mt-0.5">
                {groups.length} group{groups.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/group/new")}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: accentColor }}
            >
              <Plus size={22} color="white" />
            </Pressable>
          </View>
        </FadeIn>

        {/* Tabs */}
        <SlideIn delay={100}>
          <SimpleTabBar tabs={TABS} activeIndex={tabIndex} onTabChange={setTabIndex} style="pill" />
        </SlideIn>

        {/* Search (for Discover tab) */}
        {tabIndex === 1 && (
          <SlideIn delay={150}>
            <View className="flex-row items-center bg-muted/20 rounded-xl px-4 py-3 my-4">
              <Search size={18} color={mutedColor} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search groups..."
                placeholderTextColor={mutedColor}
                className="flex-1 ml-3 text-foreground"
                style={{ color: foregroundColor }}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <X size={18} color={mutedColor} />
                </Pressable>
              )}
            </View>
          </SlideIn>
        )}

        {/* Groups List */}
        <SlideIn delay={200}>
          {displayedGroups.length > 0 ? (
            displayedGroups.map((group, index) => (
              <GroupCard
                key={group.id}
                group={group}
                index={index}
                showJoinButton={tabIndex === 1}
                showHideButton={tabIndex === 1}
                onJoin={() => handleJoinGroup(group)}
                onHide={() => handleHideGroup(group.id)}
                onUnhide={tabIndex === 2 ? () => handleUnhideGroup(group.id) : undefined}
              />
            ))
          ) : (
            <Surface variant="secondary" className="p-8 rounded-2xl items-center my-4">
              <Users size={40} color={mutedColor} />
              <Text className="text-foreground font-semibold text-lg mt-3">
                {tabIndex === 0
                  ? "No groups yet"
                  : tabIndex === 1
                  ? "No groups found"
                  : "No hidden groups"}
              </Text>
              <Text className="text-muted text-sm text-center mt-1">
                {tabIndex === 0
                  ? "Create or join a group for accountability"
                  : tabIndex === 1
                  ? "Try a different search term"
                  : "Groups you hide will appear here"}
              </Text>
              {tabIndex === 0 && (
                <View className="flex-row gap-3 mt-4">
                  <Button size="sm" onPress={() => router.push("/group/new")}>
                    <Plus size={16} color="white" />
                    <Button.Label className="ml-1">Create</Button.Label>
                  </Button>
                  <Button size="sm" variant="secondary" onPress={() => router.push("/group/join")}>
                    <Button.Label>Join</Button.Label>
                  </Button>
                </View>
              )}
            </Surface>
          )}
        </SlideIn>

        <View className="h-8" />
      </ScrollView>
    </Container>
  );
}
