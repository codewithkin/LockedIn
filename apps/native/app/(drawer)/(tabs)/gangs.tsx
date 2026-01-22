import { View, Text, ScrollView, RefreshControl, Pressable } from "react-native";
import { useState, useCallback } from "react";
import { useThemeColor } from "heroui-native";
import { Zap, Users, UserPlus, Check, X, Mail } from "lucide-react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { useGang } from "@/hooks/use-data";

export default function GangsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("members");
  const { members, requests, isLoading, acceptRequest, declineRequest, removeMember, refreshGang } = useGang();
  
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshGang();
    setRefreshing(false);
  }, [refreshGang]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <Container
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-6">
        {/* Header */}
        <FadeIn>
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground mb-1">Your Gangs</Text>
            <Text className="text-muted text-sm">
              Connect with friends and stay accountable together
            </Text>
          </View>
        </FadeIn>

        {/* Stats */}
        <SlideIn delay={50}>
          <View className="flex-row gap-3 mb-6">
            <Card className="flex-1">
              <CardContent className="py-4">
                <View className="items-center gap-2">
                  <View className="w-10 h-10 rounded-xl bg-purple-100 items-center justify-center">
                    <Users size={20} color="#a855f7" />
                  </View>
                  <Text className="text-xl font-bold text-foreground">{members.length}</Text>
                  <Text className="text-xs text-muted">Gang Members</Text>
                </View>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardContent className="py-4">
                <View className="items-center gap-2">
                  <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center">
                    <Mail size={20} color="#ea580c" />
                  </View>
                  <Text className="text-xl font-bold text-foreground">{requests.length}</Text>
                  <Text className="text-xs text-muted">Pending</Text>
                </View>
              </CardContent>
            </Card>
          </View>
        </SlideIn>

        {/* Tabs */}
        <SlideIn delay={100}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="bg-card">
              <TabsTrigger value="members">
                <Text className="text-sm">Members ({members.length})</Text>
              </TabsTrigger>
              <TabsTrigger value="requests">
                <Text className="text-sm">Requests ({requests.length})</Text>
              </TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="members">
              {members.length === 0 ? (
                <Card className="mt-4">
                  <CardContent className="py-12">
                    <View className="items-center gap-3">
                      <Zap size={48} color={accentColor + "60"} />
                      <Text className="text-lg font-semibold text-foreground">No Gang Members</Text>
                      <Text className="text-center text-muted text-sm">
                        Send requests to friends to add them to your gang
                      </Text>
                      <Button className="mt-4 flex-row items-center gap-2">
                        <UserPlus size={18} color="white" />
                        <Text className="text-white font-semibold">Find Friends</Text>
                      </Button>
                    </View>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mt-4">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead flex={2}>Member</TableHead>
                          <TableHead>Since</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member, index) => (
                          <TableRow key={member.id} isLast={index === members.length - 1}>
                            <TableCell flex={2}>
                              <View className="flex-row items-center gap-2">
                                <Avatar alt={member.name} className="w-8 h-8">
                                  <AvatarImage source={{ uri: member.image }} />
                                  <AvatarFallback>
                                    <Text className="text-xs font-semibold">
                                      {member.name.split(" ").map((n) => n[0]).join("")}
                                    </Text>
                                  </AvatarFallback>
                                </Avatar>
                                <View>
                                  <Text className="text-sm font-medium text-foreground">
                                    {member.name}
                                  </Text>
                                  <Text className="text-xs text-muted">{member.email}</Text>
                                </View>
                              </View>
                            </TableCell>
                            <TableCell>
                              <Text className="text-xs text-muted">
                                {formatDate(member.mutualSince)}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Pressable
                                onPress={() => removeMember(member.id)}
                                className="p-2 rounded-lg bg-red-100"
                              >
                                <X size={14} color="#ef4444" />
                              </Pressable>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests">
              {requests.length === 0 ? (
                <Card className="mt-4">
                  <CardContent className="py-12">
                    <View className="items-center gap-3">
                      <Mail size={48} color={accentColor + "60"} />
                      <Text className="text-lg font-semibold text-foreground">No Pending Requests</Text>
                      <Text className="text-center text-muted text-sm">
                        When someone sends you a gang request, it will appear here
                      </Text>
                    </View>
                  </CardContent>
                </Card>
              ) : (
                <View className="mt-4 gap-3">
                  {requests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="py-4">
                        <View className="flex-row items-center gap-3">
                          <Avatar alt={request.fromUser.name} className="w-12 h-12">
                            <AvatarImage source={{ uri: request.fromUser.image }} />
                            <AvatarFallback>
                              <Text className="font-semibold">
                                {request.fromUser.name.split(" ").map((n) => n[0]).join("")}
                              </Text>
                            </AvatarFallback>
                          </Avatar>
                          <View className="flex-1">
                            <Text className="font-semibold text-foreground">
                              {request.fromUser.name}
                            </Text>
                            <Text className="text-xs text-muted">{request.fromUser.email}</Text>
                            <Text className="text-xs text-muted mt-1">
                              Sent {formatDate(request.createdAt)}
                            </Text>
                          </View>
                          <View className="flex-row gap-2">
                            <Pressable
                              onPress={() => acceptRequest(request.id)}
                              className="p-2 rounded-lg bg-green-100"
                            >
                              <Check size={18} color="#22c55e" />
                            </Pressable>
                            <Pressable
                              onPress={() => declineRequest(request.id)}
                              className="p-2 rounded-lg bg-red-100"
                            >
                              <X size={18} color="#ef4444" />
                            </Pressable>
                          </View>
                        </View>
                      </CardContent>
                    </Card>
                  ))}
                </View>
              )}
            </TabsContent>
          </Tabs>
        </SlideIn>
      </ScrollView>
    </Container>
  );
}
