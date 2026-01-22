import { router } from "expo-router";
import {
  Globe,
  Search,
  UserPlus,
  Target,
  TrendingUp,
  Users,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput } from "react-native";
import { useState, useMemo } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for public groups
const PUBLIC_GROUPS = [
  {
    id: "g1",
    name: "Fitness Warriors",
    description: "Dedicated to achieving fitness goals together",
    memberCount: 128,
    goalCount: 45,
    isPublic: true,
  },
  {
    id: "g2",
    name: "Finance Masters",
    description: "Building wealth and tracking savings goals",
    memberCount: 89,
    goalCount: 32,
    isPublic: true,
  },
  {
    id: "g3",
    name: "Book Club 2026",
    description: "Read more books and share insights",
    memberCount: 56,
    goalCount: 24,
    isPublic: true,
  },
];

// Mock data for public people to follow
const PUBLIC_PEOPLE = [
  {
    id: "p1",
    name: "Alex Chen",
    bio: "Fitness enthusiast and goal setter",
    followerCount: 342,
    isFollowing: false,
  },
  {
    id: "p2",
    name: "Sarah Johnson",
    bio: "Financial freedom advocate",
    followerCount: 512,
    isFollowing: false,
  },
  {
    id: "p3",
    name: "Mike Wilson",
    bio: "Entrepreneur and accountability partner",
    followerCount: 289,
    isFollowing: true,
  },
];

export default function DiscoverPage() {
  const [selectedTab, setSelectedTab] = useState("groups");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = useMemo(
    () =>
      PUBLIC_GROUPS.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const filteredPeople = useMemo(
    () =>
      PUBLIC_PEOPLE.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <Container className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
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
            </View>
          </View>
        </SlideIn>

        {/* Tabs */}
        <SlideIn delay={100}>
          <View className="px-6 mb-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="bg-card">
                <TabsTrigger value="groups">
                  <Text className="text-sm">Groups</Text>
                </TabsTrigger>
                <TabsTrigger value="people">
                  <Text className="text-sm">People</Text>
                </TabsTrigger>
              </TabsList>

              {/* Groups Tab */}
              <TabsContent value="groups">
                <View className="gap-3 mt-4">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <Card key={group.id}>
                        <CardContent className="py-4">
                          <View className="gap-3">
                            <View className="flex-row items-start justify-between gap-2">
                              <View className="flex-1">
                                <Text className="text-base font-semibold text-foreground">
                                  {group.name}
                                </Text>
                                <Text className="text-xs text-muted mt-0.5">
                                  {group.description}
                                </Text>
                              </View>
                              <Button className="px-4 py-2 rounded-lg">
                                <Text className="text-white font-semibold text-sm">Join</Text>
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
                  {filteredPeople.length > 0 ? (
                    filteredPeople.map((person) => (
                      <Card key={person.id}>
                        <CardContent className="py-4">
                          <View className="gap-3">
                            <View className="flex-row items-start justify-between gap-2">
                              <View className="flex-1">
                                <Text className="text-base font-semibold text-foreground">
                                  {person.name}
                                </Text>
                                <Text className="text-xs text-muted mt-0.5">
                                  {person.bio}
                                </Text>
                              </View>
                              <Button className={`px-4 py-2 rounded-lg ${person.isFollowing ? "bg-muted" : ""}`}>
                                <Text className={`font-semibold text-sm ${person.isFollowing ? "text-foreground" : "text-white"}`}>
                                  {person.isFollowing ? "Following" : "Follow"}
                                </Text>
                              </Button>
                            </View>

                            <Badge className="bg-muted w-max">
                              <Text className="text-foreground text-xs">
                                {person.followerCount} followers
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
