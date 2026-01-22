import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useThemeColor } from "heroui-native";
import { User, Settings, LogOut, Target, Users, Zap, LogIn } from "lucide-react-native";
import { router } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { useUser, useGoals, useGroups, useGang } from "@/hooks/use-data";
import { useAuth } from "@/contexts/auth-context";

export default function ProfileScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { user, refreshUser } = useUser();
  const { goals, refreshGoals } = useGoals();
  const { groups, refreshGroups } = useGroups();
  const { members: gangMembers, refreshGang } = useGang();
  const { isAuthenticated, signOut } = useAuth();
  
  const accentColor = useThemeColor("accent");
  const foregroundColor = useThemeColor("foreground");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshGoals(), refreshGroups(), refreshGang()]);
    setRefreshing(false);
  }, [refreshGoals, refreshGroups, refreshGang]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace("/auth/sign-in");
  }, [signOut]);

  const handleSignIn = useCallback(() => {
    router.push("/auth/sign-in");
  }, []);

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  // Guest mode - show sign in prompt
  if (!isAuthenticated) {
    return (
      <Container className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center p-6">
          <FadeIn>
            <Card className="w-full max-w-sm">
              <CardContent className="py-8">
                <View className="items-center gap-4">
                  <View className="w-20 h-20 rounded-full bg-accent/20 items-center justify-center">
                    <User size={40} color={accentColor} />
                  </View>
                  <Text className="text-xl font-bold text-foreground">Guest Mode</Text>
                  <Text className="text-center text-muted">
                    Sign in to view your profile, track your goals, and connect with others
                  </Text>
                  <Button onPress={handleSignIn} className="w-full flex-row items-center justify-center gap-2 mt-4">
                    <LogIn size={18} color="white" />
                    <Text className="text-white font-semibold">Sign In</Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          </FadeIn>
        </View>
      </Container>
    );
  }

  return (
    <Container
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-6">
        {/* Profile Header */}
        <FadeIn>
          <Card className="mb-6">
            <CardContent className="py-6">
              <View className="items-center gap-4">
                <Avatar alt={user?.name || "User"} className="w-20 h-20">
                  <AvatarImage source={{ uri: user?.avatarUrl }} />
                  <AvatarFallback>
                    <Text className="font-semibold text-xl">{initials}</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="items-center gap-1">
                  <Text className="text-xl font-bold text-foreground">
                    {user?.name || "User"}
                  </Text>
                  <Text className="text-sm text-muted">{user?.email || "user@example.com"}</Text>
                  {user?.isPublic && (
                    <Badge className="mt-2 bg-green-100">
                      <Text className="text-green-700 text-xs">Public Profile</Text>
                    </Badge>
                  )}
                </View>
              </View>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Stats Grid */}
        <SlideIn delay={100}>
          <View className="flex-row gap-3 mb-6">
            <Card className="flex-1">
              <CardContent className="py-4">
                <View className="items-center gap-2">
                  <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center">
                    <Target size={20} color="#ea580c" />
                  </View>
                  <Text className="text-xl font-bold text-foreground">{activeGoals.length}</Text>
                  <Text className="text-xs text-muted">Active</Text>
                </View>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardContent className="py-4">
                <View className="items-center gap-2">
                  <View className="w-10 h-10 rounded-xl bg-purple-100 items-center justify-center">
                    <Zap size={20} color="#a855f7" />
                  </View>
                  <Text className="text-xl font-bold text-foreground">{gangMembers.length}</Text>
                  <Text className="text-xs text-muted">Gangs</Text>
                </View>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardContent className="py-4">
                <View className="items-center gap-2">
                  <View className="w-10 h-10 rounded-xl bg-blue-100 items-center justify-center">
                    <Users size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-xl font-bold text-foreground">{groups.length}</Text>
                  <Text className="text-xs text-muted">Groups</Text>
                </View>
              </CardContent>
            </Card>
          </View>
        </SlideIn>

        {/* Goals Table */}
        <SlideIn delay={150}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Goals</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead flex={2}>Goal</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goals.length === 0 ? (
                    <TableRow isLast>
                      <TableCell flex={4}>
                        <Text className="text-muted text-center py-4">No goals yet</Text>
                      </TableCell>
                    </TableRow>
                  ) : (
                    goals.slice(0, 5).map((goal, index) => {
                      const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
                      const isCompleted = goal.isCompleted;

                      return (
                        <TableRow key={goal.id} isLast={index === Math.min(4, goals.length - 1)}>
                          <TableCell flex={2}>
                            <Text className="text-sm text-foreground" numberOfLines={1}>
                              {goal.title}
                            </Text>
                          </TableCell>
                          <TableCell>
                            <Text className="text-sm text-foreground">{progress}%</Text>
                          </TableCell>
                          <TableCell>
                            <Badge className={isCompleted ? "bg-green-100" : "bg-orange-100"}>
                              <Text
                                className={`text-xs font-semibold ${
                                  isCompleted ? "text-green-700" : "text-orange-700"
                                }`}
                              >
                                {isCompleted ? "Done" : "Active"}
                              </Text>
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </SlideIn>

        {/* Settings Section */}
        <SlideIn delay={200}>
          <Text className="text-lg font-bold text-foreground mb-4">Settings</Text>
          <View className="gap-3 mb-6">
            <Card>
              <CardContent className="py-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <Settings size={20} color={accentColor} />
                    <View>
                      <Text className="font-semibold text-foreground">Account Settings</Text>
                      <Text className="text-xs text-muted">Manage your account preferences</Text>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <User size={20} color={accentColor} />
                    <View>
                      <Text className="font-semibold text-foreground">Edit Profile</Text>
                      <Text className="text-xs text-muted">Update your profile information</Text>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>

          {/* Logout Button */}
          <Button
            variant="destructive"
            onPress={handleSignOut}
            className="w-full flex-row items-center justify-center gap-2 rounded-xl py-3"
          >
            <LogOut size={18} color="white" />
            <Text className="text-white font-semibold">Logout</Text>
          </Button>
        </SlideIn>
      </ScrollView>
    </Container>
  );
}
