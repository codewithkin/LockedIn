import { MotiView } from "moti";
import { Stack, router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import {
  Users,
  FileText,
  Globe,
  Lock,
  X,
  Image as ImageIcon,
  Sparkles,
  Shield,
  UserPlus,
} from "lucide-react-native";
import { Text, View, Pressable, Switch, TextInput, ScrollView } from "react-native";
import { useState } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { useGroups } from "@/hooks/use-data";

const GROUP_TYPES = [
  {
    value: "public",
    label: "Public",
    description: "Anyone can find and join",
    icon: Globe,
    color: "#22C55E",
  },
  {
    value: "private",
    label: "Private",
    description: "Invite only with code",
    icon: Lock,
    color: "#8B5CF6",
  },
];

export default function NewGroupScreen() {
  const { createGroup, isLoading } = useGroups();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [groupType, setGroupType] = useState<"public" | "private">("private");

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const mutedColor = useThemeColor("muted");

  const isPublic = groupType === "public";
  const selectedType = GROUP_TYPES.find((t) => t.value === groupType);

  const handleCreate = async () => {
    if (!name.trim()) return;

    const newGroup = await createGroup({
      name: name.trim(),
      description: description.trim() || undefined,
      isPublic,
    });

    router.replace(`/group/${newGroup.id}`);
  };

  const isValid = name.trim().length > 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Group",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="ml-2">
              <X size={24} color={foregroundColor} />
            </Pressable>
          ),
        }}
      />
      <Container>
        <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        <FadeIn>
          <View className="py-6">
            <Text className="text-2xl font-bold text-foreground mb-1">
              New Group
            </Text>
            <Text className="text-muted text-sm">
              Create an accountability group
            </Text>
          </View>
        </FadeIn>

        {/* Group Type Selection */}
        <SlideIn delay={50}>
          <Text className="text-foreground font-medium mb-3">
            Group Type
          </Text>
          <View className="flex-row gap-3 mb-5">
            {GROUP_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = groupType === type.value;
              return (
                <Pressable
                  key={type.value}
                  onPress={() => setGroupType(type.value as "public" | "private")}
                  className="flex-1"
                >
                  <MotiView
                    animate={{ scale: isSelected ? 1 : 0.98 }}
                    transition={{ type: "timing", duration: 150 }}
                  >
                    <Surface
                      variant="secondary"
                      className={`p-4 rounded-2xl items-center ${
                        isSelected ? "border-2" : "border border-muted/20"
                      }`}
                      style={{
                        borderColor: isSelected ? type.color : undefined,
                      }}
                    >
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mb-2"
                        style={{ backgroundColor: type.color + "20" }}
                      >
                        <Icon size={24} color={type.color} />
                      </View>
                      <Text className="text-foreground font-semibold">{type.label}</Text>
                      <Text className="text-muted text-xs text-center mt-1">
                        {type.description}
                      </Text>
                    </Surface>
                  </MotiView>
                </Pressable>
              );
            })}
          </View>
        </SlideIn>

        {/* Group Name */}
        <SlideIn delay={100}>
          <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
            <View className="flex-row items-center mb-2">
              <Users size={18} color={accentColor} />
              <Text className="text-foreground font-medium ml-2">
                Group Name *
              </Text>
            </View>
            <TextInput
              placeholder="e.g., Fitness Warriors"
              value={name}
              onChangeText={setName}
              placeholderTextColor={mutedColor}
              className="bg-muted/10 p-3 rounded-xl text-foreground"
              style={{ color: foregroundColor }}
            />
          </Surface>
        </SlideIn>

        {/* Description */}
        <SlideIn delay={150}>
          <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
            <View className="flex-row items-center mb-2">
              <FileText size={18} color={mutedColor} />
              <Text className="text-foreground font-medium ml-2">
                Description (optional)
              </Text>
            </View>
            <TextInput
              placeholder="What's this group about?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor={mutedColor}
              className="bg-muted/10 p-3 rounded-xl text-foreground"
              style={{ color: foregroundColor, minHeight: 80, textAlignVertical: "top" }}
            />
          </Surface>
        </SlideIn>

        {/* Features Info */}
        <SlideIn delay={200}>
          <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
            <Text className="text-foreground font-medium mb-3">What you'll get</Text>
            <View className="gap-3">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-accent/20 items-center justify-center mr-3">
                  <UserPlus size={16} color={accentColor} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-sm font-medium">
                    {isPublic ? "Open membership" : "Invite members"}
                  </Text>
                  <Text className="text-muted text-xs">
                    {isPublic
                      ? "Anyone can join your group"
                      : "Share an invite code to add members"}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-success/20 items-center justify-center mr-3">
                  <Shield size={16} color={successColor} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-sm font-medium">Accountability</Text>
                  <Text className="text-muted text-xs">
                    Track goals together and stay motivated
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-lg bg-warning/20 items-center justify-center mr-3">
                  <Sparkles size={16} color="#F59E0B" />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-sm font-medium">Progress sharing</Text>
                  <Text className="text-muted text-xs">
                    Share updates and celebrate wins together
                  </Text>
                </View>
              </View>
            </View>
          </Surface>
        </SlideIn>

        {/* Preview */}
        <SlideIn delay={250}>
          <Text className="text-muted text-sm mb-3">Preview</Text>
          <Surface variant="tertiary" className="p-4 rounded-2xl mb-4">
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: (selectedType?.color || accentColor) + "20" }}
              >
                <Users size={24} color={selectedType?.color || accentColor} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">
                  {name || "Group Name"}
                </Text>
                <Text className="text-muted text-xs" numberOfLines={1}>
                  {description || "No description"}
                </Text>
              </View>
              <View
                className="px-2 py-1 rounded-lg"
                style={{ backgroundColor: (selectedType?.color || accentColor) + "20" }}
              >
                <Text className="text-xs font-medium" style={{ color: selectedType?.color }}>
                  {isPublic ? "Public" : "Private"}
                </Text>
              </View>
            </View>
          </Surface>
        </SlideIn>

        {/* Create Button */}
        <SlideIn delay={300}>
          <Button
            size="lg"
            onPress={handleCreate}
            isDisabled={!isValid || isLoading}
            className="mb-8"
          >
            <Users size={18} color="white" />
            <Button.Label className="ml-2">
              {isLoading ? "Creating..." : "Create Group"}
            </Button.Label>
          </Button>
        </SlideIn>
        </ScrollView>
      </Container>
    </>
  );
}
