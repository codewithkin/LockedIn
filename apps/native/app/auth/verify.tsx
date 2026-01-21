import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Surface, Button, useThemeColor } from "heroui-native";
import { CheckCircle, XCircle, Loader2 } from "lucide-react-native";

import { Container } from "@/components/container";
import { FadeIn, ScaleIn } from "@/components/animations";
import { useAuth } from "@/contexts/auth-context";

type VerificationState = "loading" | "success" | "error";

export default function VerifyScreen() {
  const [state, setState] = useState<VerificationState>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const { token } = useLocalSearchParams<{ token: string }>();
  const { verifyMagicLink } = useAuth();
  const { width } = useWindowDimensions();

  const successColor = useThemeColor("success");
  const dangerColor = useThemeColor("danger");
  const accentColor = useThemeColor("accent");

  const isTablet = width >= 768;

  useEffect(() => {
    if (token) {
      handleVerification(token);
    } else {
      setState("error");
      setErrorMessage("No verification token provided");
    }
  }, [token]);

  const handleVerification = async (verificationToken: string) => {
    try {
      const result = await verifyMagicLink(verificationToken);
      if (result.success) {
        setState("success");
        // Navigate to main app after a short delay
        setTimeout(() => {
          router.replace("/(drawer)");
        }, 2000);
      } else {
        setState("error");
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setState("error");
      setErrorMessage(err.message || "Verification failed");
    }
  };

  const handleRetry = () => {
    router.replace("/auth/sign-in");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Container className="flex-1">
        <View className="flex-1 justify-center items-center px-6">
          {state === "loading" && (
            <FadeIn>
              <Surface
                variant="secondary"
                className="p-8 rounded-2xl items-center"
                style={{
                  maxWidth: isTablet ? 400 : undefined,
                  width: "100%",
                }}
              >
                <MotiView
                  from={{ rotate: "0deg" }}
                  animate={{ rotate: "360deg" }}
                  transition={{
                    type: "timing",
                    duration: 1000,
                    loop: true,
                  }}
                >
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-6"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <Loader2 size={40} color={accentColor} />
                  </View>
                </MotiView>
                
                <Text className="text-foreground font-bold text-xl mb-2 text-center">
                  Verifying...
                </Text>
                <Text className="text-muted text-sm text-center">
                  Please wait while we verify your magic link
                </Text>
              </Surface>
            </FadeIn>
          )}

          {state === "success" && (
            <ScaleIn>
              <Surface
                variant="secondary"
                className="p-8 rounded-2xl items-center"
                style={{
                  maxWidth: isTablet ? 400 : undefined,
                  width: "100%",
                }}
              >
                <MotiView
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-6"
                    style={{ backgroundColor: `${successColor}20` }}
                  >
                    <CheckCircle size={48} color={successColor} />
                  </View>
                </MotiView>

                <Text className="text-foreground font-bold text-xl mb-2 text-center">
                  You're signed in!
                </Text>
                <Text className="text-muted text-sm text-center">
                  Redirecting you to the app...
                </Text>
              </Surface>
            </ScaleIn>
          )}

          {state === "error" && (
            <ScaleIn>
              <Surface
                variant="secondary"
                className="p-8 rounded-2xl items-center"
                style={{
                  maxWidth: isTablet ? 400 : undefined,
                  width: "100%",
                }}
              >
                <MotiView
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-6"
                    style={{ backgroundColor: `${dangerColor}20` }}
                  >
                    <XCircle size={48} color={dangerColor} />
                  </View>
                </MotiView>

                <Text className="text-foreground font-bold text-xl mb-2 text-center">
                  Verification failed
                </Text>
                <Text className="text-muted text-sm text-center mb-6">
                  {errorMessage || "The link may have expired or is invalid"}
                </Text>

                <Button size="lg" onPress={handleRetry} className="w-full">
                  <Button.Label>Try again</Button.Label>
                </Button>
              </Surface>
            </ScaleIn>
          )}
        </View>
      </Container>
    </>
  );
}
