import { MotiView } from "moti";
import { Stack, router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import {
  Target,
  DollarSign,
  Calendar,
  FileText,
  Tag,
  X,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput } from "react-native";
import { useState } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { useGoals } from "@/hooks/use-data";
import { GOAL_CATEGORIES, GOAL_UNITS } from "@/types";

export default function NewGoalScreen() {
  const { createGoal, isLoading } = useGoals();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("$");
  const [category, setCategory] = useState("financial");
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  });

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  const handleCreate = async () => {
    if (!title.trim() || !targetValue) return;

    await createGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      targetValue: parseFloat(targetValue),
      unit,
      category,
      endDate: new Date(endDate),
    });

    router.back();
  };

  const isValid = title.trim() && targetValue && parseFloat(targetValue) > 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Create Goal",
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
              New Goal
            </Text>
            <Text className="text-muted text-sm">
              Set a goal and track your progress
            </Text>
          </View>
        </FadeIn>

        {/* Title */}
        <SlideIn delay={100}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-2">
              <Target size={18} color={foregroundColor} />
              <Text className="text-foreground font-medium ml-2">
                Goal Title *
              </Text>
            </View>
            <TextInput
              placeholder="e.g., Save $500 this month"
              value={title}
              onChangeText={setTitle}
              style={{ backgroundColor: 'transparent', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', color: foregroundColor }}
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
            <TextInput
              placeholder="Add more details about your goal..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={{ backgroundColor: 'transparent', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', color: foregroundColor }}
            />
          </Surface>
        </SlideIn>

        {/* Target Value & Unit */}
        <SlideIn delay={200}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-2">
              <DollarSign size={18} color={foregroundColor} />
              <Text className="text-foreground font-medium ml-2">
                Target Value *
              </Text>
            </View>
            <View className="flex-row gap-3">
              <TextInput
                placeholder="500"
                value={targetValue}
                onChangeText={setTargetValue}
                keyboardType="numeric"
                style={{ backgroundColor: 'transparent', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', color: foregroundColor, flex: 1 }}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-1"
              >
                <View className="flex-row gap-2">
                  {GOAL_UNITS.map((u) => (
                    <Pressable
                      key={u.value}
                      onPress={() => setUnit(u.value)}
                      className={`px-3 py-2 rounded-lg ${
                        unit === u.value ? "bg-accent" : "bg-background"
                      }`}
                    >
                      <Text
                        className={
                          unit === u.value
                            ? "text-accent-foreground font-medium"
                            : "text-muted"
                        }
                      >
                        {u.value}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </Surface>
        </SlideIn>

        {/* Category */}
        <SlideIn delay={250}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-3">
              <Tag size={18} color={foregroundColor} />
              <Text className="text-foreground font-medium ml-2">Category</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {GOAL_CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat.value}
                    onPress={() => setCategory(cat.value)}
                    className={`px-4 py-2 rounded-lg ${
                      category === cat.value ? "bg-accent" : "bg-background"
                    }`}
                  >
                    <Text
                      className={
                        category === cat.value
                          ? "text-accent-foreground font-medium"
                          : "text-muted"
                      }
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </Surface>
        </SlideIn>

        {/* End Date */}
        <SlideIn delay={300}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-6">
            <View className="flex-row items-center mb-2">
              <Calendar size={18} color={foregroundColor} />
              <Text className="text-foreground font-medium ml-2">
                Target Date *
              </Text>
            </View>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
              style={{ backgroundColor: 'transparent', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', color: foregroundColor }}
            />
            <Text className="text-muted text-xs mt-2">
              Format: YYYY-MM-DD (e.g., 2026-02-15)
            </Text>
          </Surface>
        </SlideIn>

        {/* Create Button */}
        <SlideIn delay={350}>
          <Button
            size="lg"
            onPress={handleCreate}
            isDisabled={!isValid || isLoading}
            className="mb-4"
          >
            <Target size={18} color="white" />
            <Button.Label className="ml-2">
              {isLoading ? "Creating..." : "Create Goal"}
            </Button.Label>
          </Button>
        </SlideIn>
      </Container>
    </>
  );
}
