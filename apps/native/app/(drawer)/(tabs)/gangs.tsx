import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { useThemeColor } from "heroui-native";
import { Zap, Users } from "lucide-react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";

export default function GangsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    setRefreshing(false);
  }, []);

  // TODO: Replace with real data from API
  const gangs: any[] = [];

  return (
    <Container
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-6">
        <FadeIn>
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground mb-1">Your Gangs</Text>
            <Text className="text-muted text-sm">
              Connect with friends and stay accountable together
            </Text>
          </View>
        </FadeIn>

        <SlideIn delay={100}>
          {gangs.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <View className="items-center gap-3">
                  <Zap size={48} color={accentColor + "60"} />
                  <Text className="text-lg font-semibold text-foreground">No Gangs Yet</Text>
                  <Text className="text-center text-muted text-sm">
                    Create or join a gang to connect with others and stay accountable
                  </Text>
                </View>
              </CardContent>
            </Card>
          ) : (
            <View className="gap-4">
              {gangs.map((gang) => (
                <Card key={gang.id}>
                  <CardContent className="py-4">
                    <View className="gap-3">
                      <View className="flex-row items-start justify-between">
                        <Text className="flex-1 font-semibold text-foreground">
                          {gang.name}
                        </Text>
                        <Badge className="bg-accent/10">
                          <Users size={12} color={accentColor} className="mr-1" />
                          <Text className="text-accent text-xs font-semibold">
                            {gang.memberCount}
                          </Text>
                        </Badge>
                      </View>
                      <Text className="text-sm text-muted">{gang.description}</Text>
                    </View>
                  </CardContent>
                </Card>
              ))}
            </View>
          )}
        </SlideIn>
      </ScrollView>
    </Container>
  );
}
