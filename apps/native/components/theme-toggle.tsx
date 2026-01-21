import { MotiView } from "moti";
import { Moon, Sun } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform, Pressable } from "react-native";
import { useThemeColor } from "heroui-native";

import { useAppTheme } from "@/contexts/app-theme-context";

export function ThemeToggle() {
  const { toggleTheme, isLight } = useAppTheme();
  const foregroundColor = useThemeColor("foreground");

  return (
    <Pressable
      onPress={() => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        toggleTheme();
      }}
      className="px-2.5"
    >
      <MotiView
        key={isLight ? "moon" : "sun"}
        from={{ opacity: 0, scale: 0.5, rotate: "-90deg" }}
        animate={{ opacity: 1, scale: 1, rotate: "0deg" }}
        transition={{ type: "spring", damping: 12 }}
      >
        {isLight ? (
          <Moon size={20} color={foregroundColor} />
        ) : (
          <Sun size={20} color={foregroundColor} />
        )}
      </MotiView>
    </Pressable>
  );
}
