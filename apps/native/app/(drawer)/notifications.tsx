import { useCallback, useState } from "react";
import { Text, View, Pressable, ScrollView, RefreshControl } from "react-native";
import {
  Bell,
  Check,
  Target,
  TrendingUp,
  UserPlus,
  Award,
  Trash2,
  CheckCheck,
} from "lucide-react-native";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-data";

const NOTIFICATION_ICONS = {
  goal_completed: Award,
  goal_surpassed: TrendingUp,
  gang_request: UserPlus,
  gang_accepted: UserPlus,
  group_invite: Target,
  goal_update: Target,
  default: Bell,
};

const NOTIFICATION_COLORS = {
  goal_completed: "#22c55e",
  goal_surpassed: "#6366f1",
  gang_request: "#f59e0b",
  gang_accepted: "#8b5cf6",
  group_invite: "#06b6d4",
  goal_update: "#f97316",
  default: "#6b7280",
};

function getTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    refreshNotifications 
  } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshNotifications();
    setRefreshing(false);
  }, [refreshNotifications]);
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
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-3xl font-bold text-foreground">Notifications</Text>
              {unreadCount > 0 && (
                <Badge className="bg-accent">
                  <Text className="text-white text-xs font-semibold">{unreadCount}</Text>
                </Badge>
              )}
            </View>
            <Text className="text-muted text-base">Stay updated with your progress</Text>
            
            {/* Mark All as Read */}
            {unreadCount > 0 && (
              <Pressable
                onPress={markAllAsRead}
                className="mt-3 flex-row items-center gap-2"
              >
                <CheckCheck size={16} color="#ff6b35" />
                <Text className="text-accent text-sm font-medium">Mark all as read</Text>
              </Pressable>
            )}
          </View>
        </FadeIn>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <SlideIn delay={100}>
            <View className="px-6 mb-8 gap-3">
              {notifications.map((notification) => {
                const IconComp =
                  NOTIFICATION_ICONS[
                    notification.type as keyof typeof NOTIFICATION_ICONS
                  ] || NOTIFICATION_ICONS.default;
                const color =
                  NOTIFICATION_COLORS[
                    notification.type as keyof typeof NOTIFICATION_COLORS
                  ] || NOTIFICATION_COLORS.default;

                return (
                  <Card
                    key={notification.id}
                    className={notification.isRead ? "opacity-60" : ""}
                  >
                    <CardContent className="py-4">
                      <View className="gap-3">
                        {/* Header */}
                        <View className="flex-row items-start justify-between gap-2">
                          <View className="flex-1 flex-row items-start gap-3">
                            <View className="w-10 h-10 rounded-lg items-center justify-center mt-0.5" style={{ backgroundColor: color + "20" }}>
                              <IconComp size={20} color={color} />
                            </View>
                            <View className="flex-1">
                              <Text className="text-base font-semibold text-foreground">
                                {notification.title}
                              </Text>
                              <Text className="text-sm text-muted mt-0.5">
                                {notification.body}
                              </Text>
                            </View>
                          </View>
                          <Pressable onPress={() => deleteNotification(notification.id)}>
                            <Trash2 size={18} color="#999" />
                          </Pressable>
                        </View>

                        {/* Footer with time and action */}
                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-muted">
                            {getTimeAgo(notification.createdAt)}
                          </Text>
                          {!notification.isRead && (
                            <Pressable onPress={() => markAsRead(notification.id)}>
                              <View className="px-3 py-1 rounded-full bg-accent/20">
                                <Text className="text-xs font-semibold text-accent">
                                  Mark Read
                                </Text>
                              </View>
                            </Pressable>
                          )}
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                );
              })}
            </View>
          </SlideIn>
        ) : (
          <SlideIn delay={100}>
            <View className="px-6 mb-8">
              <Card>
                <CardContent className="py-12">
                  <View className="items-center gap-3">
                    <Bell size={48} color="#d1d5db" />
                    <Text className="text-lg font-semibold text-foreground">
                      No notifications
                    </Text>
                    <Text className="text-center text-muted text-sm">
                      You're all caught up! Check back later for updates.
                    </Text>
                  </View>
                </CardContent>
              </Card>
            </View>
          </SlideIn>
        )}
      </ScrollView>
    </Container>
  );
}
