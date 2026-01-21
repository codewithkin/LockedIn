import { MotiView } from "moti";
import { useState } from "react";
import { View, Text, Pressable, useWindowDimensions, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { Stack, router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Mail, ArrowRight, Sparkles, CheckCircle } from "lucide-react-native";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, ScaleIn } from "@/components/animations";
import { useAuth } from "@/contexts/auth-context";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();
  const { width } = useWindowDimensions();

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const dangerColor = useThemeColor("danger");

  const isTablet = width >= 768;

  const handleSignIn = async () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn(email.trim().toLowerCase());
      if (result.success) {
        setIsSent(true);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setIsSent(false);
    setEmail("");
    setError(null);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Container className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-center px-6">
            {/* Logo/Header */}
            <FadeIn>
              <View className="items-center mb-10">
                <MotiView
                  from={{ scale: 0, rotate: "-180deg" }}
                  animate={{ scale: 1, rotate: "0deg" }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <View
                    className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <Sparkles size={40} color={accentColor} />
                  </View>
                </MotiView>
                <Text
                  className="text-foreground font-bold"
                  style={{ fontSize: isTablet ? 36 : 32 }}
                >
                  LockedIn
                </Text>
                <Text className="text-muted text-base mt-1">
                  Stay focused. Stay accountable.
                </Text>
              </View>
            </FadeIn>

            {!isSent ? (
              /* Sign In Form */
              <SlideIn delay={200}>
                <Surface
                  variant="secondary"
                  className="p-6 rounded-2xl"
                  style={{
                    maxWidth: isTablet ? 450 : undefined,
                    alignSelf: "center",
                    width: "100%",
                  }}
                >
                  <Text className="text-foreground font-semibold text-xl mb-2">
                    Sign in with email
                  </Text>
                  <Text className="text-muted text-sm mb-6">
                    We'll send you a magic link to sign in instantly
                  </Text>

                  <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                      <Mail size={16} color={foregroundColor} />
                      <Text className="text-foreground font-medium ml-2">
                        Email address
                      </Text>
                    </View>
                    <TextInput
                      placeholder="you@example.com"
                      value={email}
                      onChangeText={(text: string) => {
                        setEmail(text);
                        setError(null);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      style={{ backgroundColor: 'transparent', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', color: foregroundColor }}
                    />
                    {error && (
                      <MotiView
                        from={{ opacity: 0, translateY: -5 }}
                        animate={{ opacity: 1, translateY: 0 }}
                      >
                        <Text className="text-danger text-sm mt-2">{error}</Text>
                      </MotiView>
                    )}
                  </View>

                  <Button
                    size="lg"
                    onPress={handleSignIn}
                    isDisabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Button.Label>Sending...</Button.Label>
                    ) : (
                      <>
                        <Button.Label>Continue</Button.Label>
                        <ArrowRight size={18} color="white" className="ml-2" />
                      </>
                    )}
                  </Button>
                </Surface>
              </SlideIn>
            ) : (
              /* Success State */
              <ScaleIn>
                <Surface
                  variant="secondary"
                  className="p-8 rounded-2xl items-center"
                  style={{
                    maxWidth: isTablet ? 450 : undefined,
                    alignSelf: "center",
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
                    Check your email
                  </Text>
                  <Text className="text-muted text-sm text-center mb-2">
                    We sent a magic link to
                  </Text>
                  <Text className="text-foreground font-medium text-center mb-6">
                    {email}
                  </Text>

                  <View className="w-full bg-muted/20 p-4 rounded-xl mb-6">
                    <Text className="text-muted text-sm text-center">
                      Click the link in the email to sign in. The link expires in 15 minutes.
                    </Text>
                  </View>

                  <Pressable onPress={handleTryAgain}>
                    <Text className="text-accent font-medium">
                      Use a different email
                    </Text>
                  </Pressable>
                </Surface>
              </ScaleIn>
            )}

            {/* Footer */}
            <SlideIn delay={400}>
              <Text className="text-muted text-xs text-center mt-8 px-4">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Text>
            </SlideIn>
          </View>
        </KeyboardAvoidingView>
      </Container>
    </>
  );
}
