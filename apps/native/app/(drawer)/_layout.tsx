import { Compass, Info, Twitter, Home } from "lucide-react-native";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import React, { useCallback } from "react";
import { Text, View } from "react-native";

import { ThemeToggle } from "@/components/theme-toggle";

function DrawerLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");
  const themeColorMuted = useThemeColor("muted");
  const themeColorAccent = useThemeColor("accent");

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
        drawerActiveTintColor: themeColorAccent,
        drawerInactiveTintColor: themeColorMuted,
        drawerActiveBackgroundColor: themeColorAccent + "15",
      }}
    >
      {/* Main Tabs - Hidden from drawer, accessed via bottom tabs */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? themeColorAccent : themeColorMuted, fontWeight: "500" }}>
              Home
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Home
              size={size}
              color={focused ? themeColorAccent : themeColorMuted}
            />
          ),
        }}
      />
      
      {/* Discover Page */}
      <Drawer.Screen
        name="discover"
        options={{
          headerTitle: "Discover",
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? themeColorAccent : themeColorMuted, fontWeight: "500" }}>
              Discover
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Compass
              size={size}
              color={focused ? themeColorAccent : themeColorMuted}
            />
          ),
        }}
      />
      
      {/* About Page */}
      <Drawer.Screen
        name="about"
        options={{
          headerTitle: "About",
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? themeColorAccent : themeColorMuted, fontWeight: "500" }}>
              About
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Info
              size={size}
              color={focused ? themeColorAccent : themeColorMuted}
            />
          ),
        }}
      />
      
      {/* Follow Me Page */}
      <Drawer.Screen
        name="follow-me"
        options={{
          headerTitle: "Follow Me",
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? themeColorAccent : themeColorMuted, fontWeight: "500" }}>
              Follow Me
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Twitter
              size={size}
              color={focused ? themeColorAccent : themeColorMuted}
            />
          ),
        }}
      />

      {/* Hide the old index from drawer */}
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}

export default DrawerLayout;
