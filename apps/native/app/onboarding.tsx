import { MotiView } from "moti";
import { useState, useRef } from "react";
import { View, Text, Dimensions, Pressable, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import PagerView from "react-native-pager-view";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Target, Users, TrendingUp, CheckCircle, ArrowRight, Sparkles } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, ScaleIn } from "@/components/animations";

const ONBOARDING_KEY = "onboarding_completed";

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const { width, height } = useWindowDimensions();

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");

  const isTablet = width >= 768;
  const iconSize = isTablet ? 80 : 60;

  const slides: OnboardingSlide[] = [
    {
      id: "1",
      title: "Set Meaningful Goals",
      description: "Create goals that matter to you. Track your progress with visual indicators and celebrate when you surpass your targets.",
      icon: <Target size={iconSize} color={accentColor} />,
      color: accentColor,
    },
    {
      id: "2",
      title: "Stay Accountable",
      description: "Join groups with friends, family, or like-minded people. Share your journey and support each other.",
      icon: <Users size={iconSize} color={successColor} />,
      color: successColor,
    },
    {
      id: "3",
      title: "Track Progress",
      description: "Log your progress with photos as proof. Watch your goals come to life with beautiful visualizations.",
      icon: <TrendingUp size={iconSize} color={warningColor} />,
      color: warningColor,
    },
    {
      id: "4",
      title: "Achieve More",
      description: "Get notifications when you complete goals. Surpass your targets and unlock your full potential.",
      icon: <Sparkles size={iconSize} color="#8b5cf6" />,
      color: "#8b5cf6",
    },
  ];

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
    router.replace("/auth/sign-in");
  };

  return (
    <Container className="flex-1">
      <View className="flex-1">
        {/* Skip Button */}
        <View className="absolute top-4 right-4 z-10">
          <Pressable onPress={handleSkip} className="px-4 py-2">
            <Text className="text-muted text-base font-medium">Skip</Text>
          </Pressable>
        </View>

        {/* Pager */}
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {slides.map((slide, index) => (
            <View key={slide.id} className="flex-1 justify-center items-center px-8">
              <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: currentPage === index ? 1 : 0.5, scale: currentPage === index ? 1 : 0.9 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <View
                  className="w-32 h-32 rounded-full items-center justify-center mb-8"
                  style={{ backgroundColor: `${slide.color}20` }}
                >
                  {slide.icon}
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: currentPage === index ? 1 : 0, translateY: currentPage === index ? 0 : 20 }}
                transition={{ type: "timing", duration: 400, delay: 200 }}
              >
                <Text
                  className="text-foreground font-bold text-center mb-4"
                  style={{ fontSize: isTablet ? 32 : 28 }}
                >
                  {slide.title}
                </Text>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: currentPage === index ? 1 : 0, translateY: currentPage === index ? 0 : 20 }}
                transition={{ type: "timing", duration: 400, delay: 300 }}
              >
                <Text
                  className="text-muted text-center leading-relaxed"
                  style={{
                    fontSize: isTablet ? 18 : 16,
                    maxWidth: isTablet ? 500 : 320,
                  }}
                >
                  {slide.description}
                </Text>
              </MotiView>
            </View>
          ))}
        </PagerView>

        {/* Bottom Section */}
        <View className="px-6 pb-8">
          {/* Page Indicators */}
          <View className="flex-row justify-center mb-8">
            {slides.map((_, index) => (
              <MotiView
                key={index}
                animate={{
                  width: currentPage === index ? 24 : 8,
                  backgroundColor: currentPage === index ? accentColor : `${foregroundColor}30`,
                }}
                transition={{ type: "spring", damping: 15 }}
                className="h-2 rounded-full mx-1"
              />
            ))}
          </View>

          {/* Action Button */}
          <Button
            size="lg"
            onPress={handleNext}
            className="w-full"
            style={{ maxWidth: isTablet ? 400 : undefined, alignSelf: "center" }}
          >
            {currentPage === slides.length - 1 ? (
              <>
                <CheckCircle size={20} color="white" />
                <Button.Label className="ml-2">Get Started</Button.Label>
              </>
            ) : (
              <>
                <Button.Label>Continue</Button.Label>
                <ArrowRight size={20} color="white" className="ml-2" />
              </>
            )}
          </Button>
        </View>
      </View>
    </Container>
  );
}
