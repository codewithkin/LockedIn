import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    try {
      const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (e) {
      console.log("Error getting push token:", e);
    }
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}

export async function scheduleGoalCompletionNotification(
  goalTitle: string,
  isSurpassed: boolean = false
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: isSurpassed ? "🎉 Goal Surpassed!" : "✅ Goal Completed!",
      body: isSurpassed
        ? `Amazing! You've exceeded your goal: "${goalTitle}"!`
        : `Congratulations! You've completed: "${goalTitle}"!`,
      data: { type: isSurpassed ? "goal_surpassed" : "goal_completed" },
    },
    trigger: null, // Immediately
  });
}

export async function scheduleGoalReminderNotification(
  goalTitle: string,
  daysRemaining: number
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📊 Goal Reminder",
      body: `${daysRemaining} days left to complete: "${goalTitle}"`,
      data: { type: "goal_reminder" },
    },
    trigger: null,
  });
}

export function useNotificationListener(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) {
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      onNotificationReceived?.(notification);
    }
  );

  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      onNotificationResponse?.(response);
    }
  );

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}
