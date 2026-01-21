import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";
import { Home, Target, Users, Settings, User } from "lucide-react-native";
import { MotiView } from "moti";
import { View, Platform } from "react-native";

function TabBarIcon({
  icon: Icon,
  color,
  size,
  focused,
}: {
  icon: any;
  color: string;
  size: number;
  focused: boolean;
}) {
  const accentColor = useThemeColor("accent");

  return (
    <MotiView
      animate={{
        scale: focused ? 1.1 : 1,
      }}
      transition={{ type: "spring", damping: 15 }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 32,
          borderRadius: 16,
          backgroundColor: focused ? accentColor + "20" : "transparent",
        }}
      >
        <Icon size={size - 2} color={focused ? accentColor : color} />
      </View>
    </MotiView>
  );
}

export default function TabLayout() {
  const foregroundColor = useThemeColor("foreground");
  const backgroundColor = useThemeColor("background");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 28 : 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: mutedColor,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Cockpit",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon icon={Home} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: "Goals",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon icon={Target} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon icon={Users} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon icon={Settings} color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon icon={User} color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
