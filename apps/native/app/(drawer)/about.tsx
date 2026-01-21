import { MotiView } from "moti";
import { Surface, useThemeColor, Button } from "heroui-native";
import {
  Code,
  Heart,
  Target,
  Users,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  MapPin,
  Star,
  Zap,
  Award,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, Image, Linking } from "react-native";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, ScaleIn } from "@/components/animations";

function FeatureItem({
  icon: Icon,
  title,
  description,
  color,
  index = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  index?: number;
}) {
  return (
    <SlideIn delay={index * 50}>
      <View className="flex-row items-start mb-4">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-semibold text-base">{title}</Text>
          <Text className="text-muted text-sm mt-0.5">{description}</Text>
        </View>
      </View>
    </SlideIn>
  );
}

function LinkButton({
  icon: Icon,
  label,
  url,
  color,
}: {
  icon: React.ElementType;
  label: string;
  url: string;
  color: string;
}) {
  const mutedColor = useThemeColor("muted");

  return (
    <Pressable onPress={() => Linking.openURL(url)}>
      {({ pressed }) => (
        <MotiView animate={{ scale: pressed ? 0.95 : 1 }} transition={{ type: "timing", duration: 100 }}>
          <Surface variant="secondary" className="p-4 rounded-xl flex-row items-center mb-3">
            <View
              className="w-9 h-9 rounded-lg items-center justify-center mr-3"
              style={{ backgroundColor: color + "20" }}
            >
              <Icon size={18} color={color} />
            </View>
            <Text className="text-foreground font-medium flex-1">{label}</Text>
            <ExternalLink size={16} color={mutedColor} />
          </Surface>
        </MotiView>
      )}
    </Pressable>
  );
}

export default function AboutScreen() {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const dangerColor = useThemeColor("danger");
  const mutedColor = useThemeColor("muted");

  const appFeatures = [
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and track daily, weekly, and monthly goals with visual progress",
      color: accentColor,
    },
    {
      icon: Users,
      title: "Accountability Groups",
      description: "Join or create groups to stay accountable with others",
      color: successColor,
    },
    {
      icon: Star,
      title: "Gang System",
      description: "Build mutual connections with like-minded goal achievers",
      color: warningColor,
    },
    {
      icon: Zap,
      title: "Smart Reminders",
      description: "Never miss a check-in with intelligent notifications",
      color: dangerColor,
    },
  ];

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* App Info */}
        <FadeIn>
          <View className="py-6 items-center">
            <View
              className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
              style={{ backgroundColor: accentColor + "20" }}
            >
              <Target size={40} color={accentColor} />
            </View>
            <Text className="text-2xl font-bold text-foreground">LockedIn</Text>
            <Text className="text-muted text-sm mt-1">Version 1.0.0</Text>
          </View>
        </FadeIn>

        {/* Tagline */}
        <SlideIn delay={50}>
          <Surface variant="secondary" className="p-5 rounded-2xl mb-6">
            <Text className="text-foreground text-center font-medium text-lg leading-relaxed">
              "Lock in to your goals. Stay accountable. Achieve more together."
            </Text>
          </Surface>
        </SlideIn>

        {/* Features */}
        <SlideIn delay={100}>
          <Text className="text-muted text-xs font-semibold uppercase tracking-wide mb-3 ml-1">
            Features
          </Text>
          <Surface variant="secondary" className="p-4 rounded-2xl mb-6">
            {appFeatures.map((feature, index) => (
              <FeatureItem key={index} {...feature} index={index} />
            ))}
          </Surface>
        </SlideIn>

        {/* Creator Section */}
        <SlideIn delay={200}>
          <Text className="text-muted text-xs font-semibold uppercase tracking-wide mb-3 ml-1">
            Meet the Creator
          </Text>
          <Surface variant="secondary" className="p-5 rounded-2xl mb-4">
            <View className="items-center mb-4">
              <View
                className="w-16 h-16 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: accentColor + "20" }}
              >
                <Code size={28} color={accentColor} />
              </View>
              <Text className="text-foreground font-bold text-lg">Kin Leon Zinzombe</Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={12} color={mutedColor} />
                <Text className="text-muted text-sm ml-1">Mutare, Zimbabwe</Text>
              </View>
              <Text className="text-accent text-sm font-medium mt-1">Fullstack Developer</Text>
            </View>
            <Text className="text-muted text-center text-sm leading-relaxed">
              "I want to build software that not only works but wows – simple, smart, and built to last."
            </Text>
            <View className="mt-4 pt-4 border-t border-muted/20">
              <Text className="text-foreground text-center text-sm leading-relaxed">
                Need a website? An app? Something totally unique? I turn ideas into smooth, fast, and user-friendly software—no hassle.
              </Text>
            </View>
          </Surface>
        </SlideIn>

        {/* Creator Links */}
        <SlideIn delay={250}>
          <LinkButton
            icon={ExternalLink}
            label="Visit codewithkin.space"
            url="https://codewithkin.space"
            color={accentColor}
          />
          <LinkButton
            icon={Github}
            label="GitHub"
            url="https://github.com/codewithkin"
            color={foregroundColor}
          />
          <LinkButton
            icon={Linkedin}
            label="LinkedIn"
            url="https://www.linkedin.com/in/kinzinzombe-183022239"
            color="#0077B5"
          />
        </SlideIn>

        {/* Made with love */}
        <SlideIn delay={300}>
          <View className="py-6 items-center">
            <View className="flex-row items-center">
              <Text className="text-muted text-sm">Made with</Text>
              <Heart size={14} color={dangerColor} fill={dangerColor} className="mx-1" />
              <Text className="text-muted text-sm">in Zimbabwe</Text>
            </View>
            <Text className="text-muted text-xs mt-2">© 2025 Kin Leon Zinzombe</Text>
          </View>
        </SlideIn>

        <View className="h-4" />
      </ScrollView>
    </Container>
  );
}
