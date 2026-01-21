import { MotiView } from "moti";
import { Surface, useThemeColor } from "heroui-native";
import {
  Bell,
  Check,
  Target,
  Users,
  TrendingUp,
  UserPlus,
  Award,
  MessageCircle,
  Trash2,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";

// Mock data for notifications
const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    type: "goal_completed",
    title: "Goal Completed! 🎉",
    message: "You completed 'Run 50 miles this month'",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    data: { goalId: "g1", goalTitle: "Run 50 miles" },
  },
  {
    id: "n2",
    type: "gang_request",
    title: "New Gang Request",
    message: "Sarah Chen wants to join your gang",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    data: { userId: "u1", userName: "Sarah Chen" },
  },
  {
    id: "n3",
    type: "group_invite",
    title: "Group Invitation",
    message: "You've been invited to 'Fitness Warriors'",
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    data: { groupId: "gr1", groupName: "Fitness Warriors" },
  },
  {
    id: "n4",
    type: "goal_surpassed",
    title: "Goal Surpassed! 🚀",
    message: "You surpassed your target for 'Save $500'",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    data: { goalId: "g2", goalTitle: "Save $500" },
  },
  {
    id: "n5",
    type: "gang_accepted",
    title: "Gang Request Accepted",
    message: "Mike Wilson accepted your gang request",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    data: { userId: "u2", userName: "Mike Wilson" },
  },
  {
    id: "n6",
    type: "goal_update",
    title: "Gang Member Updated Goal",
    message: "Alex updated their progress on 'Morning Routine'",
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    data: { userId: "u3", userName: "Alex", goalId: "g3", goalTitle: "Morning Routine" },
  },
];

const NOTIFICATION_ICONS = {
  goal_completed: Award,
  goal_surpassed: TrendingUp,
  gang_request: UserPlus,
  gang_accepted: Users,
  group_invite: Users,
  goal_update: Target,
  default: Bell,
};

const NOTIFICATION_COLORS = {
  goal_completed: "#10b981",
  goal_surpassed: "#6366f1",
  gang_request: "#f59e0b",
  gang_accepted: "#8b5cf6",
  group_invite: "#06b6d4",
  goal_update: "#f97316",
  default: "#6b7280",
};

interface NotificationCardProps {
  notification: typeof MOCK_NOTIFICATIONS[0];
  index: number;
  onPress: () => void;
  onDelete: () => void;
  onMarkAsRead: () => void;
}

function NotificationCard({
  notification,
  index,
  onPress,
  onDelete,
  onMarkAsRead,
}: NotificationCardProps) {
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");
  const accentColor = useThemeColor("accent");

  const Icon = NOTIFICATION_ICONS[notification.type as keyof typeof NOTIFICATION_ICONS] || NOTIFICATION_ICONS.default;
  const iconColor = NOTIFICATION_COLORS[notification.type as keyof typeof NOTIFICATION_COLORS] || NOTIFICATION_COLORS.default;

  return (
    <SlideIn delay={index * 50} direction="right">
      <Pressable onPress={onPress}>
        <Surface
          variant={notification.isRead ? "secondary" : "primary"}
          className={`p-4 rounded-2xl mb-3 ${notification.isRead ? "opacity-60" : ""}`}
          style={{
            borderLeftWidth: 3,
            borderLeftColor: notification.isRead ? mutedColor : iconColor,
          }}
        >
          <View className="flex-row items-start gap-3">
            {/* Icon */}
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{ backgroundColor: iconColor + "20" }}
            >
              <Icon size={20} color={iconColor} />
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text
                className="text-sm font-semibold mb-1"
                style={{ color: foregroundColor }}
              >
                {notification.title}
              </Text>
              <Text className="text-xs mb-2" style={{ color: mutedColor }}>
                {notification.message}
              </Text>
              <Text className="text-xs" style={{ color: mutedColor }}>
                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
              </Text>
            </View>

            {/* Actions */}
            <View className="flex-row gap-2">
              {!notification.isRead && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onMarkAsRead();
                  }}
                >
                  <View
                    className="w-8 h-8 rounded-lg items-center justify-center"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <Check size={16} color={accentColor} />
                  </View>
                </Pressable>
              )}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <View
                  className="w-8 h-8 rounded-lg items-center justify-center"
                  style={{ backgroundColor: mutedColor + "20" }}
                >
                  <Trash2 size={16} color={mutedColor} />
                </View>
              </Pressable>
            </View>
          </View>
        </Surface>
      </Pressable>
    </SlideIn>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");
  const accentColor = useThemeColor("accent");

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const handleNotificationPress = (notification: typeof MOCK_NOTIFICATIONS[0]) => {
    // TODO: Navigate based on notification type
    console.log("Notification pressed:", notification);
    
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-2xl font-bold" style={{ color: foregroundColor }}>
                Notifications
              </Text>
              {unreadCount > 0 && (
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: accentColor }}
                >
                  <Text className="text-xs font-bold text-white">
                    {unreadCount} new
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm" style={{ color: mutedColor }}>
              Stay updated with your goals and gang activity
            </Text>
          </View>
        </FadeIn>

        {/* Actions */}
        {notifications.length > 0 && (
          <FadeIn delay={50}>
            <View className="flex-row gap-2 mb-4">
              {unreadCount > 0 && (
                <Pressable onPress={handleMarkAllAsRead}>
                  <View
                    className="px-4 py-2 rounded-lg flex-row items-center gap-2"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <Check size={14} color={accentColor} />
                    <Text className="text-xs font-medium" style={{ color: accentColor }}>
                      Mark all as read
                    </Text>
                  </View>
                </Pressable>
              )}
              <Pressable onPress={handleClearAll}>
                <View
                  className="px-4 py-2 rounded-lg flex-row items-center gap-2"
                  style={{ backgroundColor: mutedColor + "20" }}
                >
                  <Trash2 size={14} color={mutedColor} />
                  <Text className="text-xs font-medium" style={{ color: mutedColor }}>
                    Clear all
                  </Text>
                </View>
              </Pressable>
            </View>
          </FadeIn>
        )}

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <View className="mt-2">
            {notifications.map((notification, index) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                index={index}
                onPress={() => handleNotificationPress(notification)}
                onDelete={() => handleDelete(notification.id)}
                onMarkAsRead={() => handleMarkAsRead(notification.id)}
              />
            ))}
          </View>
        ) : (
          <FadeIn delay={100}>
            <Surface variant="secondary" className="p-8 rounded-2xl items-center mt-8">
              <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "timing", duration: 300 }}
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: accentColor + "20" }}
              >
                <Bell size={40} color={accentColor} />
              </MotiView>
              <Text
                className="text-lg font-semibold mb-2"
                style={{ color: foregroundColor }}
              >
                No notifications
              </Text>
              <Text className="text-sm text-center" style={{ color: mutedColor }}>
                You're all caught up! Check back later for updates.
              </Text>
            </Surface>
          </FadeIn>
        )}
      </ScrollView>
    </Container>
  );
}
