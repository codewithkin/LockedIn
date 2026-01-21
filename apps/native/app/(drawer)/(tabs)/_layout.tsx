import { Target, Users, Bell } from "lucide-react-native";
import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";

export default function TabLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");
  const accentColor = useThemeColor("accent");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: themeColorBackground,
        },
        headerTintColor: themeColorForeground,
        headerTitleStyle: {
          color: themeColorForeground,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: themeColorBackground,
          borderTopColor: "transparent",
        },
        tabBarActiveTintColor: themeColorForeground,
        tabBarInactiveTintColor: themeColorForeground + "80",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Goals",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Target size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Groups",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
