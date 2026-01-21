import { MotiView } from "moti";
import { router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Check, X } from "lucide-react-native";
import { Text, View, Pressable } from "react-native";

import { Container } from "@/components/container";
import { ScaleIn } from "@/components/animations";

function Modal() {
  const accentForegroundColor = useThemeColor("accent-foreground");
  const accentColor = useThemeColor("accent");
  const foregroundColor = useThemeColor("foreground");

  function handleClose() {
    router.back();
  }

  return (
    <Container>
      <View className="flex-1 justify-center items-center p-4">
        <ScaleIn>
          <Surface variant="secondary" className="p-5 w-full max-w-sm rounded-xl">
            <View className="items-center">
              <MotiView
                from={{ scale: 0, rotate: "-180deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                transition={{ type: "spring", damping: 10, delay: 200 }}
              >
                <View className="w-14 h-14 bg-accent rounded-xl items-center justify-center mb-4">
                  <Check size={28} color={accentForegroundColor} />
                </View>
              </MotiView>
              <Text className="text-foreground font-semibold text-xl mb-2">
                Modal Screen
              </Text>
              <Text className="text-muted text-sm text-center mb-6">
                This is an example modal screen for dialogs and confirmations.
              </Text>
            </View>
            <Button onPress={handleClose} className="w-full" size="lg">
              <X size={18} color="white" />
              <Button.Label className="ml-2">Close</Button.Label>
            </Button>
          </Surface>
        </ScaleIn>
      </View>
    </Container>
  );
}

export default Modal;
