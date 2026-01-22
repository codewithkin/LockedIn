import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useThemeColor } from "heroui-native";
import { User, Settings, LogOut } from "lucide-react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";

export default function ProfileScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const accentColor = useThemeColor("accent");
  const foregroundColor = useThemeColor("foreground");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    setRefreshing(false);
  }, []);

  // TODO: Replace with real user data from API
  const user = {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

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
                <Avatar alt={user.name}>
                  <AvatarImage source={{ uri: user.avatarUrl }} />
                  <AvatarFallback>
                    <Text className="font-semibold">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </AvatarFallback>
                </Avatar>
                <View className="items-center gap-1">
                  <Text className="text-xl font-bold text-foreground">
                    {user.name}
                  </Text>
                  <Text className="text-sm text-muted">{user.email}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Stats */}
        <SlideIn delay={100}>
          <Card className="mb-6">
            <CardContent className="py-6">
              <View className="flex-row gap-4 justify-around">
                <View className="items-center gap-2">
                  <Text className="text-2xl font-bold text-accent">12</Text>
                  <Text className="text-xs text-muted">Active Goals</Text>
                </View>
                <View className="items-center gap-2">
                  <Text className="text-2xl font-bold text-accent">5</Text>
                  <Text className="text-xs text-muted">Gangs</Text>
                </View>
                <View className="items-center gap-2">
                  <Text className="text-2xl font-bold text-accent">8</Text>
                  <Text className="text-xs text-muted">Groups</Text>
                </View>
              </View>
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
                      <Text className="font-semibold text-foreground">
                        Account Settings
                      </Text>
                      <Text className="text-xs text-muted">
                        Manage your account preferences
                      </Text>
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
                      <Text className="font-semibold text-foreground">
                        Profile
                      </Text>
                      <Text className="text-xs text-muted">
                        Edit your profile information
                      </Text>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>

          {/* Logout Button */}
          <Button variant="destructive" className="w-full flex-row items-center justify-center gap-2 rounded-xl py-3">
            <LogOut size={18} color="white" />
            <Text className="text-white font-semibold">Logout</Text>
          </Button>
        </SlideIn>
      </ScrollView>
    </Container>
  );
}
