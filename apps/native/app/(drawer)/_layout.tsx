import { Compass, Info, Twitter, Settings, Bell, Home } from "lucide-react-native";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "heroui-native";
import React, { useCallback } from "react";
import { Text, View, Pressable } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";

function DrawerLayout() {
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");
  const themeColorMuted = useThemeColor("muted");
  const themeColorAccent = useThemeColor("accent");

  const renderHeaderRight = useCallback(() => (
    <View className="flex-row items-center gap-3 mr-4">
      <ThemeToggle />
      <UserMenu />
    </View>
  ), []);

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        headerTintColor: themeColorForeground,
        headerStyle: { 
          backgroundColor: themeColorBackground,
          borderBottomColor: themeColorForeground + "15",
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          fontWeight: "600",
          color: themeColorForeground,
        },
        headerRight: renderHeaderRight,
        drawerStyle: { 
          backgroundColor: themeColorBackground,
        },
        drawerActiveTintColor: themeColorAccent,
        drawerInactiveTintColor: themeColorMuted,
        drawerActiveBackgroundColor: themeColorAccent + "15",
        drawerLabelStyle: {
          marginLeft: -16,
        },
      }}
    >
      {/* Main Tabs */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: "LockedIn",
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
      
      {/* Crew Page */}
      <Drawer.Screen
        name="crew"
        options={{
          headerTitle: "Crews",
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? themeColorAccent : themeColorMuted, fontWeight: "500" }}>
              Crews
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Settings
              size={size}
              color={focused ? themeColorAccent : themeColorMuted}
            />
          ),
        }}
      />
      
      {/* Notifications Page */}
      <Drawer.Screen
        name="notifications"
        options={{
          headerTitle: "Notifications",
          drawerLabel: ({ focused }) => (
            <Text style={{ color: focused ? themeColorAccent : themeColorMuted, fontWeight: "500" }}>
              Notifications
            </Text>
          ),
          drawerIcon: ({ size, focused }) => (
            <Bell
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
