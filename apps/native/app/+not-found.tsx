import { MotiView } from "moti";
import { Link, Stack } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Home, Search } from "lucide-react-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { ScaleIn, FadeIn } from "@/components/animations";

export default function NotFoundScreen() {
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");

  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <Container>
        <View className="flex-1 justify-center items-center p-4">
          <ScaleIn>
            <Surface variant="secondary" className="items-center p-8 max-w-sm rounded-xl">
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, delay: 200 }}
              >
                <View className="w-20 h-20 rounded-full bg-muted/20 items-center justify-center mb-4">
                  <Search size={40} color={mutedColor} />
                </View>
              </MotiView>
              <Text className="text-foreground font-bold text-xl mb-2">
                Page Not Found
              </Text>
              <Text className="text-muted text-sm text-center mb-6">
                The page you're looking for doesn't exist or has been moved.
              </Text>
              <Link href="/" asChild>
                <Button size="lg" className="w-full">
                  <Home size={18} color="white" />
                  <Button.Label className="ml-2">Go Home</Button.Label>
                </Button>
              </Link>
            </Surface>
          </ScaleIn>
        </View>
      </Container>
    </>
  );
}
