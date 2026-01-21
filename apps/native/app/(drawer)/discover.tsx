import { MotiView } from "moti";
import { router } from "expo-router";
import { Surface, useThemeColor, Button } from "heroui-native";
import {
  Users,
  User,
  Globe,
  Search,
  UserPlus,
  X,
  Crown,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput, Image } from "react-native";
import { useState, useMemo } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { SimpleTabBar } from "@/components/tabs";

type DiscoverFilter = "groups" | "people";

// Mock data for public groups
const PUBLIC_GROUPS = [
  {
    id: "g1",
    name: "Fitness Warriors",
    description: "Dedicated to achieving fitness goals together",
    memberCount: 128,
    goalCount: 45,
    isPublic: true,
    image: null,
  },
  {
    id: "g2",
    name: "Finance Masters",
    description: "Building wealth and tracking savings goals",
    memberCount: 89,
    goalCount: 32,
    isPublic: true,
    image: null,
  },
  {
    id: "g3",
    name: "Book Club 2026",
    description: "Read more books and share insights",
    memberCount: 56,
    goalCount: 24,
    isPublic: true,
    image: null,
  },
  {
    id: "g4",
    name: "Morning Routines",
    description: "Building better morning habits",
    memberCount: 234,
    goalCount: 78,
    isPublic: true,
    image: null,
  },
];

// Mock data for public profiles
const PUBLIC_PROFILES = [
  {
    id: "u1",
    name: "Alex Chen",
    email: "alex@example.com",
    image: null,
    goalCount: 12,
    completedCount: 8,
    gangCount: 45,
  },
  {
    id: "u2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    image: null,
    goalCount: 18,
    completedCount: 15,
    gangCount: 89,
  },
  {
    id: "u3",
    name: "Mike Wilson",
    email: "mike@example.com",
    image: null,
    goalCount: 7,
    completedCount: 5,
    gangCount: 32,
  },
];

function GroupCard({
  group,
  index = 0,
  onJoin,
}: {
  group: typeof PUBLIC_GROUPS[0];
  index?: number;
  onJoin?: () => void;
}) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const mutedColor = useThemeColor("muted");

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
                    <Globe size={14} color={successColor} />
                  </View>
                  <Text className="text-muted text-xs mt-0.5" numberOfLines={2}>
                    {group.description}
                  </Text>
                  <View className="flex-row items-center gap-4 mt-2">
                    <Text className="text-muted text-xs">
                      {group.memberCount} members
                    </Text>
                    <Text className="text-muted text-xs">
                      {group.goalCount} goals
                    </Text>
                  </View>
                </View>

                {/* Join button */}
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
              </View>
            </Surface>
          </MotiView>
        )}
      </Pressable>
    </SlideIn>
  );
}

function ProfileCard({
  profile,
  index = 0,
  onAddGang,
}: {
  profile: typeof PUBLIC_PROFILES[0];
  index?: number;
  onAddGang?: () => void;
}) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const mutedColor = useThemeColor("muted");

  return (
    <SlideIn delay={index * 50}>
      <Pressable onPress={() => router.push(`/profile/${profile.id}`)}>
        {({ pressed }) => (
          <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: "timing", duration: 100 }}>
            <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
              <View className="flex-row items-center">
                {/* Avatar */}
                {profile.image ? (
                  <Image
                    source={{ uri: profile.image }}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                ) : (
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <User size={26} color={accentColor} />
                  </View>
                )}

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-foreground font-semibold text-base">
                    {profile.name}
                  </Text>
                  <View className="flex-row items-center gap-3 mt-1">
                    <View className="flex-row items-center">
                      <Target size={12} color={accentColor} />
                      <Text className="text-muted text-xs ml-1">{profile.goalCount}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <TrendingUp size={12} color={successColor} />
                      <Text className="text-muted text-xs ml-1">{profile.completedCount}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Users size={12} color={warningColor} />
                      <Text className="text-muted text-xs ml-1">{profile.gangCount}</Text>
                    </View>
                  </View>
                </View>

                {/* Add to gang button */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onAddGang?.();
                  }}
                >
                  <View
                    className="px-3 py-2 rounded-lg flex-row items-center"
                    style={{ backgroundColor: warningColor }}
                  >
                    <UserPlus size={14} color="white" />
                  </View>
                </Pressable>
              </View>
            </Surface>
          </MotiView>
        )}
      </Pressable>
    </SlideIn>
  );
}

export default function DiscoverScreen() {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return PUBLIC_GROUPS;
    return PUBLIC_GROUPS.filter(
      (g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredProfiles = useMemo(() => {
    if (!searchQuery) return PUBLIC_PROFILES;
    return PUBLIC_PROFILES.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleJoinGroup = (group: typeof PUBLIC_GROUPS[0]) => {
    // TODO: API call to join group
    console.log("Joining group:", group.id);
  };

  const handleAddGang = (profile: typeof PUBLIC_PROFILES[0]) => {
    // TODO: API call to send gang request
    console.log("Sending gang request to:", profile.id);
  };

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Header */}
        <FadeIn>
          <View className="py-6">
            <Text className="text-2xl font-bold text-foreground">Discover</Text>
            <Text className="text-muted text-sm mt-0.5">
              Find public groups and people
            </Text>
          </View>
        </FadeIn>

        {/* Search */}
        <SlideIn delay={50}>
          <View className="flex-row items-center bg-muted/20 rounded-xl px-4 py-3 mb-4">
            <Search size={18} color={mutedColor} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search groups or people..."
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

        {/* Tabs */}
        <SlideIn delay={100}>
          <SimpleTabBar
            tabs={["Groups", "People"]}
            activeIndex={tabIndex}
            onTabChange={setTabIndex}
            style="pill"
          />
        </SlideIn>

        {/* Content */}
        <View className="mt-4">
          {tabIndex === 0 ? (
            // Groups
            filteredGroups.length > 0 ? (
              filteredGroups.map((group, index) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  index={index}
                  onJoin={() => handleJoinGroup(group)}
                />
              ))
            ) : (
              <Surface variant="secondary" className="p-8 rounded-2xl items-center">
                <Users size={40} color={mutedColor} />
                <Text className="text-foreground font-semibold text-lg mt-3">
                  No groups found
                </Text>
                <Text className="text-muted text-sm text-center mt-1">
                  Try a different search term
                </Text>
              </Surface>
            )
          ) : (
            // People
            filteredProfiles.length > 0 ? (
              filteredProfiles.map((profile, index) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  index={index}
                  onAddGang={() => handleAddGang(profile)}
                />
              ))
            ) : (
              <Surface variant="secondary" className="p-8 rounded-2xl items-center">
                <User size={40} color={mutedColor} />
                <Text className="text-foreground font-semibold text-lg mt-3">
                  No people found
                </Text>
                <Text className="text-muted text-sm text-center mt-1">
                  Try a different search term
                </Text>
              </Surface>
            )
          )}
        </View>

        <View className="h-8" />
      </ScrollView>
    </Container>
  );
}
