import { Home, Target, Users, Settings } from "lucide-react-native";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import React, { useCallback } from "react";
import { Pressable, Text } from "react-native";

import { ThemeToggle } from "@/components/theme-toggle";

function DrawerLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");
  const themeColorMuted = useThemeColor("muted");

  const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  return (
    <Drawer
      screenOptions={{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: {
          fontWeight: "600",
          color: themeColorForeground,
        },
        headerRight: renderThemeToggle,
        drawerStyle: { backgroundColor: themeColorBackground },
        drawerActiveTintColor: themeColorForeground,
        drawerInactiveTintColor: themeColorMuted,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: "LockedIn",
          drawerLabel: ({ color, focused }) => (
            <Text style={{ color: focused ? themeColorForeground : themeColorMuted }}>
              Home
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Home
              size={size}
              color={focused ? themeColorForeground : themeColorMuted}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: "Goals",
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? themeColorForeground : themeColorMuted }}>
              Goals
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Target
              size={size}
              color={focused ? themeColorForeground : themeColorMuted}
            />
          ),
          headerRight: () => (
            <Link href="/goal/new" asChild>
              <Pressable className="mr-4">
                <Target size={22} color={themeColorForeground} />
              </Pressable>
            </Link>
          ),
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
