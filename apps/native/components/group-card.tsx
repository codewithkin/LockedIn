import { MotiView } from "moti";
import { Link } from "expo-router";
import { Surface, Chip, useThemeColor } from "heroui-native";
import { Users, Lock, Globe, ChevronRight, Crown } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import type { Group } from "@/types";
import { SlideIn } from "./animations";

interface GroupCardProps {
  group: Group;
  index?: number;
  currentUserId?: string;
}

export function GroupCard({ group, index = 0, currentUserId = "user_1" }: GroupCardProps) {
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");
  const accentColor = useThemeColor("accent");
  const warningColor = useThemeColor("warning");

  const isOwner = group.ownerId === currentUserId;
  const memberCount = group.members.length;

  return (
    <SlideIn delay={index * 80}>
      <Link href={`/group/${group.id}`} asChild>
        <Pressable>
          {({ pressed }) => (
            <MotiView
              animate={{ scale: pressed ? 0.98 : 1 }}
              transition={{ type: "timing", duration: 100 }}
            >
              <Surface
                variant="secondary"
                className="p-4 rounded-xl mb-3"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-row items-center flex-1 mr-3">
                    <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-3">
                      <Users size={24} color={accentColor} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-foreground font-semibold text-base mr-2">
                          {group.name}
                        </Text>
                        {isOwner && (
                          <Crown size={14} color={warningColor} />
                        )}
                      </View>
                      {group.description && (
                        <Text className="text-muted text-xs" numberOfLines={1}>
                          {group.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Chip
                    size="sm"
                    color={group.isPublic ? "success" : "default"}
                  >
                    {group.isPublic ? (
                      <Globe size={12} color={foregroundColor} />
                    ) : (
                      <Lock size={12} color={foregroundColor} />
                    )}
                    <Chip.Label className="ml-1">
                      {group.isPublic ? "Public" : "Private"}
                    </Chip.Label>
                  </Chip>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="flex-row -space-x-2">
                      {[...Array(Math.min(3, memberCount))].map((_, i) => (
                        <View
                          key={i}
                          className="w-6 h-6 rounded-full bg-muted/50 border-2 border-background items-center justify-center"
                        >
                          <Text className="text-xs text-muted">{i + 1}</Text>
                        </View>
                      ))}
                      {memberCount > 3 && (
                        <View className="w-6 h-6 rounded-full bg-accent/20 border-2 border-background items-center justify-center">
                          <Text className="text-xs text-accent">+{memberCount - 3}</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-muted text-xs ml-2">
                      {memberCount} member{memberCount !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <ChevronRight size={16} color={mutedColor} />
                  </View>
                </View>
              </Surface>
            </MotiView>
          )}
        </Pressable>
      </Link>
    </SlideIn>
  );
}
