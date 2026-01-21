import "@/global.css";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";
import { registerForPushNotificationsAsync } from "@/lib/notifications";

export const unstable_settings = {
  initialRouteName: "(drawer)",
};

function StackLayout() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ title: "Modal", presentation: "modal" }} />
      <Stack.Screen
        name="goal/[id]"
        options={{ title: "Goal Details", presentation: "card" }}
      />
      <Stack.Screen
        name="goal/new"
        options={{ title: "New Goal", presentation: "modal" }}
      />
      <Stack.Screen
        name="goal/update/[id]"
        options={{ title: "Log Progress", presentation: "modal" }}
      />
      <Stack.Screen
        name="group/[id]"
        options={{ title: "Group", presentation: "card" }}
      />
      <Stack.Screen
        name="group/new"
        options={{ title: "New Group", presentation: "modal" }}
      />
      <Stack.Screen
        name="group/join"
        options={{ title: "Join Group", presentation: "modal" }}
      />
    </Stack>
  );
}

export default function Layout() {
  useEffect(() => {
    // Register for push notifications on app start
    registerForPushNotificationsAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AppThemeProvider>
          <HeroUINativeProvider>
            <StackLayout />
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
