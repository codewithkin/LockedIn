import { Text, View, ScrollView, Pressable, Linking } from "react-native";
import {
  Code,
  Heart,
  Target,
  Users,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Star,
  Zap,
  Award,
} from "lucide-react-native";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set and track goals with visual progress",
    color: "#ff6b35",
  },
  {
    icon: Users,
    title: "Accountability Groups",
    description: "Join groups and stay accountable with others",
    color: "#00b4d8",
  },
  {
    icon: Sparkles,
    title: "Progress Analytics",
    description: "See your progress with detailed analytics",
    color: "#ffd60a",
  },
  {
    icon: Award,
    title: "Achievements",
    description: "Unlock badges and celebrate milestones",
    color: "#00b4d8",
  },
];

export default function AboutPage() {
  return (
    <Container className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <FadeIn>
          <View className="p-6 items-center">
            <View className="w-16 h-16 rounded-2xl bg-accent/20 items-center justify-center mb-4">
              <Zap size={32} color="#ff6b35" />
            </View>
            <Text className="text-3xl font-bold text-foreground mb-2 text-center">
              LockedIn
            </Text>
            <Text className="text-muted text-base text-center">
              Your personal accountability app
            </Text>
            <Badge className="mt-4 bg-accent/20">
              <Text className="text-accent text-xs font-semibold">Version 1.0.0</Text>
            </Badge>
          </View>
        </FadeIn>

        {/* About Section */}
        <SlideIn delay={100}>
          <View className="px-6 mb-8">
            <Card>
              <CardContent className="py-6">
                <Text className="text-base font-semibold text-foreground mb-2">
                  About LockedIn
                </Text>
                <Text className="text-sm text-muted leading-6">
                  LockedIn is designed to help you achieve your goals through accountability, community,
                  and consistent progress tracking. Set ambitious goals, track your progress, and stay
                  motivated with your accountability groups.
                </Text>
              </CardContent>
            </Card>
          </View>
        </SlideIn>

        {/* Features Section */}
        <SlideIn delay={150}>
          <View className="px-6 mb-8">
            <Text className="text-lg font-bold text-foreground mb-4">Features</Text>
            <View className="gap-3">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title}>
                    <CardContent className="py-4">
                      <View className="flex-row items-start gap-3">
                        <View
                          className="w-10 h-10 rounded-lg items-center justify-center"
                          style={{ backgroundColor: feature.color + "20" }}
                        >
                          <Icon size={20} color={feature.color} />
                        </View>
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-foreground">
                            {feature.title}
                          </Text>
                          <Text className="text-xs text-muted mt-1">
                            {feature.description}
                          </Text>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                );
              })}
            </View>
          </View>
        </SlideIn>

        {/* Links Section */}
        <SlideIn delay={200}>
          <View className="px-6 mb-8">
            <Text className="text-lg font-bold text-foreground mb-4">Connect</Text>
            <Button
              onPress={() => Linking.openURL("https://github.com")}
              className="mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-2">
                <Github size={18} color="white" />
                <Text className="text-white font-semibold">GitHub</Text>
              </View>
              <ExternalLink size={16} color="white" />
            </Button>
            <Button
              onPress={() => Linking.openURL("https://linkedin.com")}
              className="bg-muted flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-2">
                <Linkedin size={18} color="#666" />
                <Text className="text-foreground font-semibold">LinkedIn</Text>
              </View>
              <ExternalLink size={16} color="#666" />
            </Button>
          </View>
        </SlideIn>

        {/* Footer */}
        <FadeIn delay={250}>
          <View className="px-6 pb-8 items-center">
            <View className="flex-row items-center gap-1 mb-2">
              <Heart size={16} color="#ff6b35" />
              <Text className="text-sm text-muted">Made with care</Text>
            </View>
            <Text className="text-xs text-muted">© 2025 LockedIn. All rights reserved.</Text>
          </View>
        </FadeIn>
      </ScrollView>
    </Container>
  );
}
