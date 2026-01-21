import { MotiView } from "moti";
import { Surface, useThemeColor, Button } from "heroui-native";
import {
  Twitter,
  Github,
  Linkedin,
  Globe,
  Youtube,
  ExternalLink,
  Heart,
  MessageCircle,
  Users,
  Code,
  Sparkles,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, Linking } from "react-native";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";

type SocialLink = {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: React.ElementType;
  color: string;
  followers?: string;
  description: string;
};

function SocialCard({
  social,
  index = 0,
}: {
  social: SocialLink;
  index?: number;
}) {
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");

  const Icon = social.icon;

  return (
    <SlideIn delay={index * 50}>
      <Pressable onPress={() => Linking.openURL(social.url)}>
        {({ pressed }) => (
          <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: "timing", duration: 100 }}>
            <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
              <View className="flex-row items-center">
                {/* Icon */}
                <View
                  className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: social.color + "20" }}
                >
                  <Icon size={26} color={social.color} />
                </View>

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-foreground font-semibold text-base">{social.name}</Text>
                  <Text className="text-accent text-sm">{social.handle}</Text>
                  <Text className="text-muted text-xs mt-0.5" numberOfLines={1}>
                    {social.description}
                  </Text>
                </View>

                {/* Arrow */}
                <ExternalLink size={18} color={mutedColor} />
              </View>
            </Surface>
          </MotiView>
        )}
      </Pressable>
    </SlideIn>
  );
}

export default function FollowMeScreen() {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const dangerColor = useThemeColor("danger");
  const mutedColor = useThemeColor("muted");

  const socialLinks: SocialLink[] = [
    {
      id: "twitter",
      name: "X (Twitter)",
      handle: "@codewithkin",
      url: "https://x.com/codewithkin",
      icon: Twitter,
      color: "#1DA1F2",
      description: "Daily dev thoughts, tips, and project updates",
    },
    {
      id: "github",
      name: "GitHub",
      handle: "@codewithkin",
      url: "https://github.com/codewithkin",
      icon: Github,
      color: foregroundColor,
      description: "Open source projects and code",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      handle: "Kin Leon Zinzombe",
      url: "https://www.linkedin.com/in/kinzinzombe-183022239",
      icon: Linkedin,
      color: "#0077B5",
      description: "Professional updates and networking",
    },
    {
      id: "website",
      name: "Portfolio",
      handle: "codewithkin.space",
      url: "https://codewithkin.space",
      icon: Globe,
      color: accentColor,
      description: "Full portfolio and services",
    },
  ];

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Header */}
        <FadeIn>
          <View className="py-6 items-center">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: accentColor + "20" }}
            >
              <Code size={36} color={accentColor} />
            </View>
            <Text className="text-2xl font-bold text-foreground">@codewithkin</Text>
            <Text className="text-muted text-sm mt-1">Kin Leon Zinzombe</Text>
          </View>
        </FadeIn>

        {/* Bio */}
        <SlideIn delay={50}>
          <Surface variant="secondary" className="p-5 rounded-2xl mb-6">
            <Text className="text-foreground text-center leading-relaxed">
              Fullstack Developer from Zimbabwe 🇿🇼 building software that wows.{"\n\n"}
              Follow along for dev content, project updates, and behind-the-scenes of building LockedIn and other cool projects!
            </Text>
          </Surface>
        </SlideIn>

        {/* Social Links */}
        <SlideIn delay={100}>
          <Text className="text-muted text-xs font-semibold uppercase tracking-wide mb-3 ml-1">
            Connect
          </Text>
        </SlideIn>

        {socialLinks.map((social, index) => (
          <SocialCard key={social.id} social={social} index={index + 2} />
        ))}

        {/* Support Section */}
        <SlideIn delay={300}>
          <Surface variant="secondary" className="p-5 rounded-2xl mt-4 mb-6">
            <View className="items-center">
              <View className="flex-row items-center mb-3">
                <Heart size={20} color={dangerColor} fill={dangerColor} />
                <Text className="text-foreground font-semibold text-lg ml-2">
                  Support the Work
                </Text>
              </View>
              <Text className="text-muted text-center text-sm mb-4">
                If you enjoy LockedIn or my other projects, consider supporting the development!
              </Text>
              <Button
                onPress={() => Linking.openURL("https://calendly.com/codewithkin/client-project-brief")}
              >
                <MessageCircle size={16} color="white" />
                <Button.Label className="ml-2">Book a Call</Button.Label>
              </Button>
            </View>
          </Surface>
        </SlideIn>

        {/* Footer */}
        <SlideIn delay={350}>
          <View className="items-center pb-6">
            <View className="flex-row items-center gap-2">
              <Sparkles size={14} color={warningColor} />
              <Text className="text-muted text-sm">Let's build something great together</Text>
              <Sparkles size={14} color={warningColor} />
            </View>
          </View>
        </SlideIn>

        <View className="h-4" />
      </ScrollView>
    </Container>
  );
}
