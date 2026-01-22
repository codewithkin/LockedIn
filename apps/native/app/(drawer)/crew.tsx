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
import { Text, View, Pressable, ScrollView, TextInput, RefreshControl, ActivityIndicator } from "react-native";
import { useState, useCallback, useEffect, useRef } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCrews, useDiscover, useRequireAuth } from "@/hooks/use-data";

export default function CrewPage() {
  const { crews, myCrews, joinedCrews, isLoading, createCrew, leaveCrew, refreshCrews } = useCrews();
  const { groups: publicGroups, isLoading: isLoadingDiscover, fetchGroups } = useDiscover();
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const [selectedTab, setSelectedTab] = useState("my-crews");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search for public groups
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      if (selectedTab === "discover") {
        fetchGroups(searchQuery);
      }
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, selectedTab, fetchGroups]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refreshCrews(), fetchGroups(searchQuery)]);
    setIsRefreshing(false);
  }, [refreshCrews, fetchGroups, searchQuery]);

  const handleCrewPress = (crewId: string) => {
    console.log("Navigate to crew:", crewId);
  };

  const handleJoinCrew = (crewId: string) => {
    requireAuth(() => {
      console.log("Join crew:", crewId);
    });
  };

  const handleCreateCrew = () => {
    requireAuth(() => {
      console.log("Create new crew");
    });
  };

  const filteredCrews = crews.filter((crew) =>
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

        {/* Stats */}
        <SlideIn delay={50}>
          <View className="px-6 mb-6">
            <View className="flex-row gap-3">
              <Card className="flex-1">
                <CardContent className="py-4">
                  <View className="items-center gap-2">
                    <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center">
                      <Crown size={20} color="#ea580c" />
                    </View>
                    <Text className="text-xl font-bold text-foreground">{myCrews.length}</Text>
                    <Text className="text-xs text-muted">Owned</Text>
                  </View>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardContent className="py-4">
                  <View className="items-center gap-2">
                    <View className="w-10 h-10 rounded-xl bg-blue-100 items-center justify-center">
                      <Users size={20} color="#3b82f6" />
                    </View>
                    <Text className="text-xl font-bold text-foreground">{joinedCrews.length}</Text>
                    <Text className="text-xs text-muted">Joined</Text>
                  </View>
                </CardContent>
              </Card>
              
              <Card className="flex-1">
                <CardContent className="py-4">
                  <View className="items-center gap-2">
                    <View className="w-10 h-10 rounded-xl bg-green-100 items-center justify-center">
                      <Target size={20} color="#22c55e" />
                    </View>
                    <Text className="text-xl font-bold text-foreground">
                      {crews.reduce((acc, c) => acc + c.goalCount, 0)}
                    </Text>
                    <Text className="text-xs text-muted">Goals</Text>
                  </View>
                </CardContent>
              </Card>
            </View>
          </View>
        </SlideIn>

        {/* Search Bar */}
        <SlideIn delay={100}>
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
        <SlideIn delay={150}>
          <View className="px-6 mb-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="bg-card">
                <TabsTrigger value="my-crews">
                  <Text className="text-sm">My Crews ({crews.length})</Text>
                </TabsTrigger>
                <TabsTrigger value="discover">
                  <Text className="text-sm">Discover</Text>
                </TabsTrigger>
              </TabsList>

              {/* My Crews Tab */}
              <TabsContent value="my-crews">
                {/* Create Crew Button */}
                <Pressable onPress={handleCreateCrew} className="mt-4">
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

                {/* Crews List */}
                {filteredCrews.length > 0 ? (
                  <View className="mt-4 gap-3">
                    {filteredCrews.map((crew) => (
                      <Pressable key={crew.id} onPress={() => handleCrewPress(crew.id)}>
                        <Card>
                          <CardContent className="py-4">
                            <View className="gap-3">
                              <View className="flex-row items-start justify-between gap-2">
                                <View className="flex-1 gap-1">
                                  <View className="flex-row items-center gap-2">
                                    <Text className="text-base font-semibold text-foreground flex-1">
                                      {crew.name}
                                    </Text>
                                    {crew.isOwner && (
                                      <Badge className="bg-accent/20">
                                        <Text className="text-accent text-xs font-semibold">Owner</Text>
                                      </Badge>
                                    )}
                                  </View>
                                </View>
                              </View>

                              {crew.description && (
                                <Text className="text-sm text-muted" numberOfLines={2}>
                                  {crew.description}
                                </Text>
                              )}

                              <View className="flex-row gap-4">
                                <View className="flex-row items-center gap-1">
                                  <Users size={12} color="#999" />
                                  <Text className="text-xs text-muted">{crew.memberCount} members</Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                  <Target size={12} color="#999" />
                                  <Text className="text-xs text-muted">{crew.goalCount} goals</Text>
                                </View>
                              </View>
                            </View>
                          </CardContent>
                        </Card>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <Card className="mt-4">
                    <CardContent className="py-12">
                      <View className="items-center gap-3">
                        <Users size={48} color="#d1d5db" />
                        <Text className="text-lg font-semibold text-foreground">No crews yet</Text>
                        <Text className="text-center text-muted text-sm">
                          Create a crew or join one to get started
                        </Text>
                      </View>
                    </CardContent>
                  </Card>
                )}

                {/* Crew Stats Table */}
                {crews.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Crew Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead flex={2}>Crew</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead>Goals</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {crews.map((crew, index) => (
                            <TableRow key={crew.id} isLast={index === crews.length - 1}>
                              <TableCell flex={2}>
                                <Text className="text-sm text-foreground font-medium" numberOfLines={1}>
                                  {crew.name}
                                </Text>
                              </TableCell>
                              <TableCell>
                                <Text className="text-sm text-foreground">{crew.memberCount}</Text>
                              </TableCell>
                              <TableCell>
                                <Text className="text-sm text-foreground">{crew.goalCount}</Text>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Discover Tab */}
              <TabsContent value="discover">
                <View className="mt-4">
                  <View className="flex-row items-center gap-2 mb-4">
                    <Sparkles size={18} color="#ff6b35" />
                    <Text className="text-base font-semibold text-foreground">Popular Crews</Text>
                  </View>

                  {isLoadingDiscover ? (
                    <View className="py-8 items-center">
                      <ActivityIndicator size="large" color="#ff6b35" />
                    </View>
                  ) : publicGroups.length > 0 ? (
                    <View className="gap-3">
                      {publicGroups.map((group) => (
                        <Card key={group.id}>
                          <CardContent className="py-4">
                            <View className="gap-3">
                              <View className="flex-row items-start justify-between gap-2">
                                <View className="flex-1 gap-1">
                                  <Text className="text-base font-semibold text-foreground">
                                    {group.name}
                                  </Text>
                                  {group.description && (
                                    <Text className="text-xs text-muted" numberOfLines={2}>
                                      {group.description}
                                    </Text>
                                  )}
                                </View>
                                <Button
                                  onPress={() => handleJoinCrew(group.id)}
                                  disabled={group.isMember}
                                  className={`px-4 py-2 rounded-lg ${group.isMember ? "opacity-50" : ""}`}
                                >
                                  <Text className="text-white font-semibold text-sm">
                                    {group.isMember ? "Joined" : "Join"}
                                  </Text>
                                </Button>
                              </View>

                              <View className="flex-row gap-3">
                                <Badge className="bg-muted">
                                  <Text className="text-foreground text-xs">
                                    {group.memberCount.toLocaleString()} members
                                  </Text>
                                </Badge>
                                <Badge className="bg-muted">
                                  <Text className="text-foreground text-xs">{group.goalCount} goals</Text>
                                </Badge>
                              </View>
                            </View>
                          </CardContent>
                        </Card>
                      ))}
                    </View>
                  ) : (
                    <Card>
                      <CardContent className="py-8">
                        <View className="items-center gap-3">
                          <Globe size={40} color="#d1d5db" />
                          <Text className="text-center text-muted">
                            No public crews found
                          </Text>
                        </View>
                      </CardContent>
                    </Card>
                  )}
                </View>
              </TabsContent>
            </Tabs>
          </View>
        </SlideIn>
      </ScrollView>
    </Container>
  );
}
