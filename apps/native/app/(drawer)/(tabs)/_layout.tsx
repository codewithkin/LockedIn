import { BarChart3, Target, Users, Zap, User } from "lucide-react-native";
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
        tabBarStyle: {
          backgroundColor: themeColorBackground,
          borderTopColor: themeColorForeground + "15",
          paddingBottom: 5,
        },
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: themeColorForeground + "60",
      }}
    >
      {/* Cockpit - Home */}
      <Tabs.Screen
        name="cockpit"
        options={{
          title: "Cockpit",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      
      {/* Goals */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Goals",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Target size={size} color={color} />
          ),
        }}
      />
      
      {/* Gangs */}
      <Tabs.Screen
        name="gangs"
        options={{
          title: "Gangs",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Zap size={size} color={color} />
          ),
        }}
      />
      
      {/* Groups */}
      <Tabs.Screen
        name="two"
        options={{
          title: "Groups",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      
      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
