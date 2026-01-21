import { MotiView } from "moti";
import { Stack, router } from "expo-router";
import { Button, Surface, Input, useThemeColor } from "heroui-native";
import { Users, FileText, Globe, Lock, X } from "lucide-react-native";
import { Text, View, Pressable, Switch } from "react-native";
import { useState } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { useGroups } from "@/hooks/use-data";

export default function NewGroupScreen() {
  const { createGroup, isLoading } = useGroups();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");

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
      <Container className="p-4">
        <FadeIn>
          <View className="mb-6">
            <Text className="text-2xl font-bold text-foreground mb-1">
              New Group
            </Text>
            <Text className="text-muted text-sm">
              Create an accountability group
            </Text>
          </View>
        </FadeIn>

        {/* Group Name */}
        <SlideIn delay={100}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-2">
              <Users size={18} color={foregroundColor} />
              <Text className="text-foreground font-medium ml-2">
                Group Name *
              </Text>
            </View>
            <Input
              placeholder="e.g., Fitness Warriors"
              value={name}
              onChangeText={setName}
              className="bg-background"
            />
          </Surface>
        </SlideIn>

        {/* Description */}
        <SlideIn delay={150}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-2">
              <FileText size={18} color={foregroundColor} />
              <Text className="text-foreground font-medium ml-2">
                Description (optional)
              </Text>
            </View>
            <Input
              placeholder="What's this group about?"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              className="bg-background"
            />
          </Surface>
        </SlideIn>

        {/* Visibility */}
        <SlideIn delay={200}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                {isPublic ? (
                  <Globe size={18} color={successColor} />
                ) : (
                  <Lock size={18} color={foregroundColor} />
                )}
                <View className="ml-3 flex-1">
                  <Text className="text-foreground font-medium">
                    {isPublic ? "Public Group" : "Private Group"}
                  </Text>
                  <Text className="text-muted text-xs">
                    {isPublic
                      ? "Anyone can find and join"
                      : "Invite only with code"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isPublic}
                onValueChange={setIsPublic}
                trackColor={{ false: "#767577", true: successColor }}
              />
            </View>
          </Surface>
        </SlideIn>

        {/* Preview */}
        <SlideIn delay={250}>
          <Text className="text-muted text-sm mb-3">Preview</Text>
          <Surface variant="tertiary" className="p-4 rounded-xl mb-6">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-accent/20 items-center justify-center mr-3">
                <Users size={24} color={accentColor} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">
                  {name || "Group Name"}
                </Text>
                <Text className="text-muted text-xs">
                  {description || "No description"}
                </Text>
              </View>
              <View className="px-2 py-1 rounded bg-muted/20">
                <Text className="text-muted text-xs">
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
            disabled={!isValid || isLoading}
          >
            <Users size={18} color="white" />
            <Button.Label className="ml-2">
              {isLoading ? "Creating..." : "Create Group"}
            </Button.Label>
          </Button>
        </SlideIn>
      </Container>
    </>
  );
}
