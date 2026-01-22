import { router } from "expo-router";
import {
  Globe,
  Search,
  UserPlus,
  Target,
  TrendingUp,
  Users,
  RefreshCw,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput, RefreshControl, ActivityIndicator } from "react-native";
import { useState, useEffect, useCallback } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDiscover } from "@/hooks/use-data";
import { useAuth } from "@/contexts/auth-context";

export default function DiscoverPage() {
  const { groups, people, isLoading, refresh, joinGroup, followPerson, fetchGroups, fetchPeople } = useDiscover();
  const { isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState("groups");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedTab === "groups") {
        fetchGroups(searchQuery);
      } else {
        fetchPeople(searchQuery);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh(searchQuery);
    setRefreshing(false);
  }, [refresh, searchQuery]);

  const handleJoinGroup = async (groupId: string) => {
    await joinGroup(groupId);
  };

  const handleFollowPerson = async (personId: string) => {
    await followPerson(personId);
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPeople = people.filter((p) =>
    (p.name || p.email).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className="flex-1 bg-background">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <FadeIn>
          <View className="p-6">
            <Text className="text-3xl font-bold text-foreground mb-1">Discover</Text>
            <Text className="text-muted text-base">Find groups and people to follow</Text>
          </View>
        </FadeIn>

        {/* Search Bar */}
        <SlideIn delay={50}>
          <View className="px-6 mb-4">
            <View className="flex-row items-center rounded-xl px-4 py-3 bg-muted/10 border border-muted/20">
              <Search size={20} color="#999" />
              <TextInput
                className="flex-1 ml-2 text-base text-foreground"
                placeholder="Search..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {isLoading && <ActivityIndicator size="small" color="#ff6b35" />}
            </View>
          </View>
        </SlideIn>

        {/* Tabs */}
        <SlideIn delay={100}>
          <View className="px-6 mb-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="bg-card">
                <TabsTrigger value="groups">
                  <Text className="text-sm">Groups ({groups.length})</Text>
                </TabsTrigger>
                <TabsTrigger value="people">
                  <Text className="text-sm">People ({people.length})</Text>
                </TabsTrigger>
              </TabsList>

              {/* Groups Tab */}
              <TabsContent value="groups">
                <View className="gap-3 mt-4">
                  {isLoading && groups.length === 0 ? (
                    <Card>
                      <CardContent className="py-8">
                        <View className="items-center gap-2">
                          <ActivityIndicator size="large" color="#ff6b35" />
                          <Text className="text-muted">Loading groups...</Text>
                        </View>
                      </CardContent>
                    </Card>
                  ) : filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <Card key={group.id}>
                        <CardContent className="py-4">
                          <View className="gap-3">
                            <View className="flex-row items-start justify-between gap-2">
                              <View className="flex-1">
                                <Text className="text-base font-semibold text-foreground">
                                  {group.name}
                                </Text>
                                <Text className="text-xs text-muted mt-0.5" numberOfLines={2}>
                                  {group.description || "No description"}
                                </Text>
                              </View>
                              <Button 
                                className={`px-4 py-2 rounded-lg ${group.isMember ? "bg-muted" : ""}`}
                                onPress={() => handleJoinGroup(group.id)}
                                disabled={group.isMember}
                              >
                                <Text className={`font-semibold text-sm ${group.isMember ? "text-foreground" : "text-white"}`}>
                                  {group.isMember ? "Joined" : "Join"}
                                </Text>
                              </Button>
                            </View>

                            <View className="flex-row gap-3">
                              <Badge className="bg-muted">
                                <Users size={12} color="#666" />
                                <Text className="text-foreground text-xs ml-1">
                                  {group.memberCount} members
                                </Text>
                              </Badge>
                              <Badge className="bg-muted">
                                <Target size={12} color="#666" />
                                <Text className="text-foreground text-xs ml-1">
                                  {group.goalCount} goals
                                </Text>
                              </Badge>
                            </View>
                          </View>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8">
                        <View className="items-center gap-2">
                          <Globe size={40} color="#d1d5db" />
                          <Text className="text-base font-semibold text-foreground">
                            No groups found
                          </Text>
                        </View>
                      </CardContent>
                    </Card>
                  )}

                  {/* Groups Summary Table */}
                  {filteredGroups.length > 0 && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle>Groups Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead flex={2}>Name</TableHead>
                              <TableHead>Members</TableHead>
                              <TableHead>Goals</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredGroups.map((group, index) => (
                              <TableRow key={group.id} isLast={index === filteredGroups.length - 1}>
                                <TableCell flex={2}>
                                  <Text className="text-sm text-foreground font-medium" numberOfLines={1}>
                                    {group.name}
                                  </Text>
                                </TableCell>
                                <TableCell>
                                  <Text className="text-sm text-foreground">{group.memberCount}</Text>
                                </TableCell>
                                <TableCell>
                                  <Text className="text-sm text-foreground">{group.goalCount}</Text>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </View>
              </TabsContent>

              {/* People Tab */}
              <TabsContent value="people">
                <View className="gap-3 mt-4">
                  {isLoading && people.length === 0 ? (
                    <Card>
                      <CardContent className="py-8">
                        <View className="items-center gap-2">
                          <ActivityIndicator size="large" color="#ff6b35" />
                          <Text className="text-muted">Loading people...</Text>
                        </View>
                      </CardContent>
                    </Card>
                  ) : filteredPeople.length > 0 ? (
                    filteredPeople.map((person) => (
                      <Card key={person.id}>
                        <CardContent className="py-4">
                          <View className="gap-3">
                            <View className="flex-row items-start justify-between gap-2">
                              <View className="flex-1">
                                <Text className="text-base font-semibold text-foreground">
                                  {person.name || person.email}
                                </Text>
                                <Text className="text-xs text-muted mt-0.5">
                                  {person.email}
                                </Text>
                              </View>
                              <Button 
                                className={`px-4 py-2 rounded-lg ${person.isFollowing ? "bg-muted" : ""}`}
                                onPress={() => handleFollowPerson(person.id)}
                                disabled={person.isFollowing}
                              >
                                <Text className={`font-semibold text-sm ${person.isFollowing ? "text-foreground" : "text-white"}`}>
                                  {person.isFollowing ? "Connected" : "Connect"}
                                </Text>
                              </Button>
                            </View>

                            <Badge className="bg-muted w-max">
                              <Target size={12} color="#666" />
                              <Text className="text-foreground text-xs ml-1">
                                {person.goalCount} goals
                              </Text>
                            </Badge>
                          </View>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-8">
                        <View className="items-center gap-2">
                          <Users size={40} color="#d1d5db" />
                          <Text className="text-base font-semibold text-foreground">
                            No people found
                          </Text>
                          <Text className="text-sm text-muted text-center">
                            {!isAuthenticated ? "Sign in to discover people" : "No public profiles available"}
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
