import {
  Twitter,
  Github,
  Linkedin,
  Globe,
  Youtube,
  ExternalLink,
  Heart,
} from "lucide-react-native";
import { Text, View, ScrollView, Pressable, Linking } from "react-native";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type SocialLink = {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: React.ElementType;
  color: string;
  description: string;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "twitter",
    name: "Twitter",
    handle: "@lockedin",
    url: "https://twitter.com",
    icon: Twitter,
    color: "#1DA1F2",
    description: "Follow for updates and tips",
  },
  {
    id: "github",
    name: "GitHub",
    handle: "lockedin-app",
    url: "https://github.com",
    icon: Github,
    color: "#000000",
    description: "Check out our code",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "lockedin",
    url: "https://linkedin.com",
    icon: Linkedin,
    color: "#0A66C2",
    description: "Connect with us",
  },
  {
    id: "website",
    name: "Website",
    handle: "lockedin.app",
    url: "https://lockedin.app",
    icon: Globe,
    color: "#ff6b35",
    description: "Visit our website",
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: "LockedInApp",
    url: "https://youtube.com",
    icon: Youtube,
    color: "#FF0000",
    description: "Watch tutorials and demos",
  },
];

export default function FollowMePage() {
  return (
    <Container className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <FadeIn>
          <View className="p-6 items-center">
            <View className="w-16 h-16 rounded-2xl bg-accent/20 items-center justify-center mb-4">
              <Heart size={32} color="#ff6b35" />
            </View>
            <Text className="text-3xl font-bold text-foreground mb-2">Follow Us</Text>
            <Text className="text-muted text-base text-center">
              Stay connected and updated
            </Text>
          </View>
        </FadeIn>

        {/* Social Links */}
        <SlideIn delay={100}>
          <View className="px-6 mb-8 gap-3">
            {SOCIAL_LINKS.map((social, index) => {
              const Icon = social.icon;
              return (
                <Pressable
                  key={social.id}
                  onPress={() => Linking.openURL(social.url)}
                >
                  <Card>
                    <CardContent className="py-4">
                      <View className="flex-row items-center justify-between gap-3">
                        <View className="flex-row items-center gap-3 flex-1">
                          <View
                            className="w-12 h-12 rounded-lg items-center justify-center"
                            style={{ backgroundColor: social.color + "20" }}
                          >
                            <Icon size={24} color={social.color} />
                          </View>
                          <View className="flex-1">
                            <Text className="text-base font-semibold text-foreground">
                              {social.name}
                            </Text>
                            <View className="flex-row items-center gap-2 mt-1">
                              <Badge className="bg-muted">
                                <Text className="text-foreground text-xs">
                                  {social.handle}
                                </Text>
                              </Badge>
                            </View>
                          </View>
                        </View>
                        <ExternalLink size={18} color="#999" />
                      </View>
                    </CardContent>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        </SlideIn>

        {/* Footer */}
        <FadeIn delay={200}>
          <View className="px-6 pb-8 items-center">
            <Card>
              <CardContent className="py-6">
                <View className="items-center gap-2">
                  <Heart size={24} color="#ff6b35" />
                  <Text className="text-base font-semibold text-foreground text-center">
                    Thanks for supporting LockedIn!
                  </Text>
                  <Text className="text-sm text-muted text-center mt-2">
                    Your feedback and engagement help us improve
                  </Text>
                </View>
              </CardContent>
            </Card>
          </View>
        </FadeIn>
      </ScrollView>
    </Container>
  );
}
