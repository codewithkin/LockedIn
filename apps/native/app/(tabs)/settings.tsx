import { MotiView } from "moti";
import { Surface, useThemeColor, Button } from "heroui-native";
import {
  Bell,
  BellRing,
  Calendar,
  Clock,
  MessageSquare,
  Users,
  Trophy,
  AlertCircle,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, Switch } from "react-native";
import { useState } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";

type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
};

function NotificationToggle({
  setting,
  index = 0,
  onToggle,
}: {
  setting: NotificationSetting;
  index?: number;
  onToggle: (id: string, value: boolean) => void;
}) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  const Icon = setting.icon;

  return (
    <SlideIn delay={index * 50}>
      <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
        <View className="flex-row items-center">
          <View
            className="w-11 h-11 rounded-xl items-center justify-center mr-4"
            style={{ backgroundColor: setting.enabled ? accentColor + "20" : mutedColor + "10" }}
          >
            <Icon size={22} color={setting.enabled ? accentColor : mutedColor} />
          </View>
          <View className="flex-1">
            <Text className="text-foreground font-medium text-base">{setting.label}</Text>
            <Text className="text-muted text-xs mt-0.5" numberOfLines={2}>
              {setting.description}
            </Text>
          </View>
          <Switch
            value={setting.enabled}
            onValueChange={(value) => onToggle(setting.id, value)}
            trackColor={{ false: mutedColor + "30", true: accentColor }}
            thumbColor="white"
          />
        </View>
      </Surface>
    </SlideIn>
  );
}

function SectionHeader({ title, index = 0 }: { title: string; index?: number }) {
  return (
    <SlideIn delay={index * 50}>
      <Text className="text-muted text-xs font-semibold uppercase tracking-wide mt-4 mb-2 ml-1">
        {title}
      </Text>
    </SlideIn>
  );
}

export default function SettingsScreen() {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const mutedColor = useThemeColor("muted");

  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: "daily_reminder",
      label: "Daily Reminder",
      description: "Get reminded to check in on your goals every day",
      icon: Calendar,
      enabled: true,
    },
    {
      id: "deadline_alerts",
      label: "Deadline Alerts",
      description: "Notifications when goals are approaching their deadline",
      icon: Clock,
      enabled: true,
    },
    {
      id: "group_activity",
      label: "Group Activity",
      description: "Updates when someone in your group makes progress",
      icon: Users,
      enabled: true,
    },
    {
      id: "milestone_celebrations",
      label: "Milestone Celebrations",
      description: "Celebrate when you hit milestones and achievements",
      icon: Trophy,
      enabled: true,
    },
    {
      id: "gang_requests",
      label: "Gang Requests",
      description: "Notifications when someone wants to join your gang",
      icon: MessageSquare,
      enabled: true,
    },
    {
      id: "goal_updates",
      label: "Goal Updates",
      description: "Updates about goals you're watching or participating in",
      icon: BellRing,
      enabled: false,
    },
  ]);

  const [masterNotifications, setMasterNotifications] = useState(true);

  const toggleSetting = (id: string, value: boolean) => {
    setNotificationSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: value } : s))
    );
  };

  const toggleAllNotifications = (value: boolean) => {
    setMasterNotifications(value);
    setNotificationSettings((prev) => prev.map((s) => ({ ...s, enabled: value })));
  };

  const enabledCount = notificationSettings.filter((s) => s.enabled).length;

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Header */}
        <FadeIn>
          <View className="py-6">
            <Text className="text-2xl font-bold text-foreground">Settings</Text>
            <Text className="text-muted text-sm mt-0.5">Customize your experience</Text>
          </View>
        </FadeIn>

        {/* Master Toggle */}
        <SlideIn delay={50}>
          <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: masterNotifications ? accentColor : mutedColor + "20" }}
              >
                <Bell size={24} color={masterNotifications ? "white" : mutedColor} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold text-lg">All Notifications</Text>
                <Text className="text-muted text-sm">
                  {masterNotifications
                    ? `${enabledCount} of ${notificationSettings.length} enabled`
                    : "All notifications disabled"}
                </Text>
              </View>
              <Switch
                value={masterNotifications}
                onValueChange={toggleAllNotifications}
                trackColor={{ false: mutedColor + "30", true: accentColor }}
                thumbColor="white"
              />
            </View>
          </Surface>
        </SlideIn>

        {/* Notification Settings */}
        {masterNotifications && (
          <>
            <SectionHeader title="Notification Preferences" index={1} />
            {notificationSettings.map((setting, index) => (
              <NotificationToggle
                key={setting.id}
                setting={setting}
                index={index + 2}
                onToggle={toggleSetting}
              />
            ))}
          </>
        )}

        {/* Info Card */}
        <SlideIn delay={400}>
          <Surface variant="secondary" className="p-4 rounded-2xl mt-4 flex-row items-start">
            <AlertCircle size={18} color={accentColor} className="mt-0.5" />
            <View className="flex-1 ml-3">
              <Text className="text-foreground font-medium text-sm">
                Push Notifications
              </Text>
              <Text className="text-muted text-xs mt-1">
                Make sure notifications are enabled in your device settings for LockedIn to
                receive push notifications.
              </Text>
            </View>
          </Surface>
        </SlideIn>

        <View className="h-8" />
      </ScrollView>
    </Container>
  );
}
