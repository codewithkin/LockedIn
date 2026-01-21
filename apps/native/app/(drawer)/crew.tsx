import { MotiView } from "moti";
import { router } from "expo-router";
import { Surface, useThemeColor, Button } from "heroui-native";
import {
  Users,
  Plus,
  Search,
  Crown,
  Lock,
  Globe,
  Target,
  MessageCircle,
  ChevronRight,
  Settings,
  Sparkles,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput, Image, RefreshControl } from "react-native";
import { useState, useCallback } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { SimpleTabBar } from "@/components/tabs";

type CrewFilter = "my-crews" | "discover";

// Mock data for user's crews
const MY_CREWS = [
  {
    id: "c1",
    name: "Fitness Squad",
    description: "Working out together and hitting our fitness goals",
    memberCount: 12,
    groupCount: 3,
    goalCount: 8,
    isPublic: false,
    isOwner: true,
    avatarUrl: null,
    coverUrl: null,
    lastActivity: "2 hours ago",
    unreadMessages: 5,
  },
  {
    id: "c2",
    name: "Tech Entrepreneurs",
    description: "Building startups and holding each other accountable",
    memberCount: 24,
    groupCount: 5,
    goalCount: 15,
    isPublic: true,
    isOwner: false,
    avatarUrl: null,
    coverUrl: null,
    lastActivity: "30 mins ago",
    unreadMessages: 12,
  },
  {
    id: "c3",
    name: "Book Lovers Club",
    description: "Reading goals and book discussions",
    memberCount: 45,
    groupCount: 2,
    goalCount: 6,
    isPublic: true,
    isOwner: false,
    avatarUrl: null,
    coverUrl: null,
    lastActivity: "1 day ago",
    unreadMessages: 0,
  },
];

// Mock data for discoverable public crews
const DISCOVER_CREWS = [
  {
    id: "d1",
    name: "Global Runners",
    description: "Runners from around the world tracking miles together",
    memberCount: 1234,
    groupCount: 15,
    goalCount: 45,
    isPublic: true,
    avatarUrl: null,
  },
  {
    id: "d2",
    name: "Money Makers",
    description: "Financial goals and wealth building community",
    memberCount: 892,
    groupCount: 8,
    goalCount: 32,
    isPublic: true,
    avatarUrl: null,
  },
  {
    id: "d3",
    name: "Early Risers",
    description: "5AM club - morning routine accountability",
    memberCount: 567,
    groupCount: 6,
    goalCount: 18,
    isPublic: true,
    avatarUrl: null,
  },
  {
    id: "d4",
    name: "Study Squad",
    description: "Students helping students achieve academic goals",
    memberCount: 2341,
    groupCount: 20,
    goalCount: 78,
    isPublic: true,
    avatarUrl: null,
  },
];

interface CrewCardProps {
  crew: typeof MY_CREWS[0];
  index?: number;
  onPress?: () => void;
}

function CrewCard({ crew, index = 0, onPress }: CrewCardProps) {
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");
  const accentColor = useThemeColor("accent");

  return (
    <SlideIn delay={index * 100} direction="right">
      <Pressable onPress={onPress}>
        <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
          <View>
            {/* Header with avatar and badges */}
            <View className="flex-row items-start gap-3 mb-3">
              {/* Avatar */}
              <View
                className="w-14 h-14 rounded-xl items-center justify-center"
                style={{ backgroundColor: accentColor + "20" }}
              >
                {crew.avatarUrl ? (
                  <Image
                    source={{ uri: crew.avatarUrl }}
                    className="w-14 h-14 rounded-xl"
                  />
                ) : (
                  <Users size={28} color={accentColor} />
                )}
              </View>

              {/* Name and badges */}
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Text
                    className="text-base font-semibold flex-1"
                    style={{ color: foregroundColor }}
                    numberOfLines={1}
                  >
                    {crew.name}
                  </Text>
                  {crew.isOwner && (
                    <View
                      className="px-2 py-0.5 rounded-full flex-row items-center gap-1"
                      style={{ backgroundColor: accentColor + "20" }}
                    >
                      <Crown size={12} color={accentColor} />
                      <Text className="text-xs" style={{ color: accentColor }}>
                        Owner
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center gap-1">
                  {crew.isPublic ? (
                    <Globe size={12} color={mutedColor} />
                  ) : (
                    <Lock size={12} color={mutedColor} />
                  )}
                  <Text className="text-xs" style={{ color: mutedColor }}>
                    {crew.isPublic ? "Public" : "Private"} • {crew.memberCount} members
                  </Text>
                </View>
              </View>

              {/* Unread badge */}
              {crew.unreadMessages > 0 && (
                <View
                  className="w-6 h-6 rounded-full items-center justify-center"
                  style={{ backgroundColor: accentColor }}
                >
                  <Text className="text-xs font-bold text-white">
                    {crew.unreadMessages > 9 ? "9+" : crew.unreadMessages}
                  </Text>
                </View>
              )}
            </View>

            {/* Description */}
            <Text
              className="text-sm mb-3"
              style={{ color: mutedColor }}
              numberOfLines={2}
            >
              {crew.description}
            </Text>

            {/* Stats row */}
            <View className="flex-row items-center gap-4 mb-3">
              <View className="flex-row items-center gap-1">
                <Users size={14} color={mutedColor} />
                <Text className="text-xs" style={{ color: mutedColor }}>
                  {crew.groupCount} groups
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Target size={14} color={mutedColor} />
                <Text className="text-xs" style={{ color: mutedColor }}>
                  {crew.goalCount} goals
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MessageCircle size={14} color={mutedColor} />
                <Text className="text-xs" style={{ color: mutedColor }}>
                  {crew.lastActivity}
                </Text>
              </View>
            </View>

            {/* Action row */}
            <View className="flex-row items-center justify-between">
              <Text className="text-xs" style={{ color: mutedColor }}>
                Last active {crew.lastActivity}
              </Text>
              <ChevronRight size={18} color={mutedColor} />
            </View>
          </View>
        </Surface>
      </Pressable>
    </SlideIn>
  );
}

interface DiscoverCrewCardProps {
  crew: typeof DISCOVER_CREWS[0];
  index?: number;
  onJoin?: () => void;
}

function DiscoverCrewCard({ crew, index = 0, onJoin }: DiscoverCrewCardProps) {
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");
  const accentColor = useThemeColor("accent");

  return (
    <SlideIn delay={index * 100} direction="right">
      <Pressable onPress={onJoin}>
        <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
          <View className="flex-row items-start gap-3">
            {/* Avatar */}
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: accentColor + "20" }}
            >
              {crew.avatarUrl ? (
                <Image
                  source={{ uri: crew.avatarUrl }}
                  className="w-12 h-12 rounded-xl"
                />
              ) : (
                <Users size={24} color={accentColor} />
              )}
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text
                className="text-base font-semibold mb-1"
                style={{ color: foregroundColor }}
                numberOfLines={1}
              >
                {crew.name}
              </Text>
              <Text
                className="text-xs mb-2"
                style={{ color: mutedColor }}
                numberOfLines={2}
              >
                {crew.description}
              </Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-xs" style={{ color: mutedColor }}>
                  {crew.memberCount.toLocaleString()} members
                </Text>
                <Text className="text-xs" style={{ color: mutedColor }}>
                  {crew.groupCount} groups
                </Text>
                <Text className="text-xs" style={{ color: mutedColor }}>
                  {crew.goalCount} goals
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
                className="px-3 py-2 rounded-lg"
                style={{ backgroundColor: accentColor }}
              >
                <Text className="text-white text-xs font-medium">Join</Text>
              </View>
            </Pressable>
          </View>
        </Surface>
      </Pressable>
    </SlideIn>
  );
}

export default function CrewPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");
  const accentColor = useThemeColor("accent");
  const backgroundColor = useThemeColor("background");

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const handleCrewPress = (crewId: string) => {
    // TODO: Navigate to crew detail page
    console.log("Navigate to crew:", crewId);
  };

  const handleJoinCrew = (crewId: string) => {
    // TODO: Join crew
    console.log("Join crew:", crewId);
  };

  const handleCreateCrew = () => {
    // TODO: Navigate to create crew page
    console.log("Create new crew");
  };

  const filteredMyCrews = MY_CREWS.filter((crew) =>
    crew.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDiscoverCrews = DISCOVER_CREWS.filter((crew) =>
    crew.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className="flex-1">
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={accentColor}
          />
        }
      >
        {/* Header */}
        <FadeIn>
          <View className="py-6">
            <Text
              className="text-2xl font-bold"
              style={{ color: foregroundColor }}
            >
              Your Crews
            </Text>
            <Text className="text-sm mt-0.5" style={{ color: mutedColor }}>
              Join or create crews to connect with like-minded goal setters
            </Text>
          </View>
        </FadeIn>

        {/* Search Bar */}
        <SlideIn delay={50}>
          <View
            className="flex-row items-center rounded-xl px-4 py-3 mb-4"
            style={{ backgroundColor: mutedColor + "20" }}
          >
            <Search size={18} color={mutedColor} />
            <TextInput
              className="flex-1 ml-2 text-sm"
              placeholder="Search crews..."
              placeholderTextColor={mutedColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ color: foregroundColor }}
            />
          </View>
        </SlideIn>

        {/* Tabs */}
        <SlideIn delay={100}>
          <SimpleTabBar
            tabs={["My Crews", "Discover"]}
            activeIndex={tabIndex}
            onTabChange={setTabIndex}
            style="pill"
          />
        </SlideIn>

        {/* Content */}
        <View className="mt-4">
          {tabIndex === 0 && (
            <>
              {/* Create Crew Button */}
              <SlideIn delay={100} direction="right">
                <Pressable onPress={handleCreateCrew}>
                  <View
                    className="p-4 rounded-2xl mb-3 flex-row items-center justify-center gap-2"
                    style={{
                      borderWidth: 2,
                      borderStyle: "dashed",
                      borderColor: accentColor + "40",
                      backgroundColor: accentColor + "10",
                    }}
                  >
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center"
                      style={{ backgroundColor: accentColor + "20" }}
                    >
                      <Plus size={24} color={accentColor} />
                    </View>
                    <View>
                      <Text
                        className="text-base font-semibold"
                        style={{ color: accentColor }}
                      >
                        Create a Crew
                      </Text>
                      <Text className="text-xs" style={{ color: mutedColor }}>
                        Start your own accountability community
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </SlideIn>

              {/* My Crews List */}
              {filteredMyCrews.length > 0 ? (
                filteredMyCrews.map((crew, index) => (
                  <CrewCard
                    key={crew.id}
                    crew={crew}
                    index={index}
                    onPress={() => handleCrewPress(crew.id)}
                  />
                ))
              ) : (
                <FadeIn delay={300}>
                  <Surface variant="secondary" className="p-8 rounded-2xl items-center">
                    <MotiView
                      from={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "timing", duration: 300 }}
                      className="w-20 h-20 rounded-full items-center justify-center mb-4"
                      style={{ backgroundColor: accentColor + "20" }}
                    >
                      <Users size={40} color={accentColor} />
                    </MotiView>
                    <Text
                      className="text-lg font-semibold mb-2"
                      style={{ color: foregroundColor }}
                    >
                      No crews yet
                    </Text>
                    <Text
                      className="text-sm text-center"
                      style={{ color: mutedColor }}
                    >
                      Create a crew or join one to get started
                    </Text>
                  </Surface>
                </FadeIn>
              )}
            </>
          )}

          {tabIndex === 1 && (
            <>
              {/* Featured Crews Header */}
              <FadeIn delay={100}>
                <View className="flex-row items-center gap-2 mb-4">
                  <Sparkles size={18} color={accentColor} />
                  <Text
                    className="text-base font-semibold"
                    style={{ color: foregroundColor }}
                  >
                    Popular Crews
                  </Text>
                </View>
              </FadeIn>

              {/* Discover Crews List */}
              {filteredDiscoverCrews.map((crew, index) => (
                <DiscoverCrewCard
                  key={crew.id}
                  crew={crew}
                  index={index}
                  onJoin={() => handleJoinCrew(crew.id)}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
