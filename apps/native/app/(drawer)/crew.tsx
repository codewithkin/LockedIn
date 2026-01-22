import { router } from "expo-router";
import {
  Users,
  Plus,
  Crown,
  Lock,
  Globe,
  Target,
  MessageCircle,
  Sparkles,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput, RefreshControl } from "react-native";
import { useState, useCallback } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    lastActivity: "30 mins ago",
    unreadMessages: 12,
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
  },
  {
    id: "d2",
    name: "Money Makers",
    description: "Financial goals and wealth building community",
    memberCount: 892,
    groupCount: 8,
    goalCount: 32,
    isPublic: true,
  },
  {
    id: "d3",
    name: "Study Squad",
    description: "Students helping students achieve academic goals",
    memberCount: 2341,
    groupCount: 20,
    goalCount: 78,
    isPublic: true,
  },
];

export default function CrewPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
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
    <Container className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <FadeIn>
          <View className="p-6">
            <Text className="text-3xl font-bold text-foreground mb-1">Your Crews</Text>
            <Text className="text-muted text-base">
              Join or create crews to connect with others
            </Text>
          </View>
        </FadeIn>

        {/* Search Bar */}
        <SlideIn delay={50}>
          <View className="px-6 mb-4">
            <View className="flex-row items-center rounded-xl px-4 py-3 bg-muted/10 border border-muted/20">
              <Text className="text-muted text-base">🔍</Text>
              <TextInput
                className="flex-1 ml-2 text-base text-foreground"
                placeholder="Search crews..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </SlideIn>

        {/* Tabs */}
        <SlideIn delay={100}>
          <View className="flex-row px-6 mb-6 gap-2">
            <Pressable
              onPress={() => setTabIndex(0)}
              className={`flex-1 py-3 px-4 rounded-lg ${
                tabIndex === 0 ? "bg-accent" : "bg-muted/20"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  tabIndex === 0 ? "text-white" : "text-foreground"
                }`}
              >
                My Crews
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTabIndex(1)}
              className={`flex-1 py-3 px-4 rounded-lg ${
                tabIndex === 1 ? "bg-accent" : "bg-muted/20"
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  tabIndex === 1 ? "text-white" : "text-foreground"
                }`}
              >
                Discover
              </Text>
            </Pressable>
          </View>
        </SlideIn>

        {/* Content */}
        {tabIndex === 0 && (
          <>
            {/* Create Crew Button */}
            <SlideIn delay={100}>
              <View className="px-6 mb-6">
                <Pressable onPress={handleCreateCrew}>
                  <Card className="border border-dashed border-accent/40 bg-accent/10">
                    <CardContent className="py-6">
                      <View className="flex-row items-center gap-3">
                        <View className="w-12 h-12 rounded-xl bg-accent/20 items-center justify-center">
                          <Plus size={24} color="#ff6b35" />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-accent">
                            Create a Crew
                          </Text>
                          <Text className="text-xs text-muted">
                            Start your own community
                          </Text>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </Pressable>
              </View>
            </SlideIn>

            {/* My Crews List */}
            {filteredMyCrews.length > 0 ? (
              <SlideIn delay={150}>
                <View className="px-6 mb-8 gap-3">
                  {filteredMyCrews.map((crew, index) => (
                    <Pressable
                      key={crew.id}
                      onPress={() => handleCrewPress(crew.id)}
                    >
                      <Card>
                        <CardContent className="py-4">
                          <View className="gap-3">
                            {/* Header */}
                            <View className="flex-row items-start justify-between gap-2">
                              <View className="flex-1 gap-1">
                                <View className="flex-row items-center gap-2">
                                  <Text className="text-base font-semibold text-foreground flex-1">
                                    {crew.name}
                                  </Text>
                                  {crew.isOwner && (
                                    <Badge className="bg-accent/20">
                                      <Text className="text-accent text-xs font-semibold">
                                        Owner
                                      </Text>
                                    </Badge>
                                  )}
                                </View>
                                <View className="flex-row items-center gap-1">
                                  {crew.isPublic ? (
                                    <Globe size={12} color="#999" />
                                  ) : (
                                    <Lock size={12} color="#999" />
                                  )}
                                  <Text className="text-xs text-muted">
                                    {crew.isPublic ? "Public" : "Private"} • {crew.memberCount} members
                                  </Text>
                                </View>
                              </View>
                              {crew.unreadMessages > 0 && (
                                <View className="w-6 h-6 rounded-full bg-accent items-center justify-center">
                                  <Text className="text-xs font-bold text-white">
                                    {crew.unreadMessages > 9 ? "9+" : crew.unreadMessages}
                                  </Text>
                                </View>
                              )}
                            </View>

                            {/* Description */}
                            <Text className="text-sm text-muted" numberOfLines={2}>
                              {crew.description}
                            </Text>

                            {/* Stats */}
                            <View className="flex-row gap-4">
                              <View className="flex-row items-center gap-1">
                                <Users size={12} color="#999" />
                                <Text className="text-xs text-muted">
                                  {crew.groupCount} groups
                                </Text>
                              </View>
                              <View className="flex-row items-center gap-1">
                                <Target size={12} color="#999" />
                                <Text className="text-xs text-muted">
                                  {crew.goalCount} goals
                                </Text>
                              </View>
                              <View className="flex-row items-center gap-1">
                                <MessageCircle size={12} color="#999" />
                                <Text className="text-xs text-muted">
                                  {crew.lastActivity}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </CardContent>
                      </Card>
                    </Pressable>
                  ))}
                </View>
              </SlideIn>
            ) : (
              <SlideIn delay={150}>
                <View className="px-6 mb-8">
                  <Card>
                    <CardContent className="py-12">
                      <View className="items-center gap-3">
                        <Users size={48} color="#d1d5db" />
                        <Text className="text-lg font-semibold text-foreground">
                          No crews yet
                        </Text>
                        <Text className="text-center text-muted text-sm">
                          Create a crew or join one to get started
                        </Text>
                        <Button
                          onPress={handleCreateCrew}
                          className="mt-4 px-6 py-2 rounded-lg flex-row items-center gap-2"
                        >
                          <Plus size={16} color="white" />
                          <Text className="text-white font-semibold">Create Crew</Text>
                        </Button>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              </SlideIn>
            )}
          </>
        )}

        {/* Discover Tab */}
        {tabIndex === 1 && (
          <SlideIn delay={150}>
            <View className="px-6 mb-8">
              <View className="flex-row items-center gap-2 mb-4">
                <Sparkles size={18} color="#ff6b35" />
                <Text className="text-base font-semibold text-foreground">
                  Popular Crews
                </Text>
              </View>

              <View className="gap-3">
                {filteredDiscoverCrews.map((crew) => (
                  <Card key={crew.id}>
                    <CardContent className="py-4">
                      <View className="gap-3">
                        <View className="flex-row items-start justify-between gap-2">
                          <View className="flex-1 gap-1">
                            <Text className="text-base font-semibold text-foreground">
                              {crew.name}
                            </Text>
                            <Text className="text-xs text-muted" numberOfLines={2}>
                              {crew.description}
                            </Text>
                          </View>
                          <Button
                            onPress={() => handleJoinCrew(crew.id)}
                            className="px-4 py-2 rounded-lg"
                          >
                            <Text className="text-white font-semibold text-sm">Join</Text>
                          </Button>
                        </View>

                        <View className="flex-row gap-3 text-xs">
                          <Badge className="bg-muted">
                            <Text className="text-foreground text-xs">
                              {crew.memberCount.toLocaleString()} members
                            </Text>
                          </Badge>
                          <Badge className="bg-muted">
                            <Text className="text-foreground text-xs">
                              {crew.groupCount} groups
                            </Text>
                          </Badge>
                          <Badge className="bg-muted">
                            <Text className="text-foreground text-xs">
                              {crew.goalCount} goals
                            </Text>
                          </Badge>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                ))}
              </View>
            </View>
          </SlideIn>
        )}
      </ScrollView>
    </Container>
  );
}
