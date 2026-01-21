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
  Clock,
  Dumbbell,
  BookOpen,
  Briefcase,
  Heart,
  GraduationCap,
  PiggyBank,
  Palette,
  Plane,
  Users,
  Leaf,
  Star,
  Image as ImageIcon,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput } from "react-native";
import { useState } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { useGoals } from "@/hooks/use-data";
import { SimpleTabBar } from "@/components/tabs";

// Enhanced categories with icons
const GOAL_CATEGORIES = [
  { value: "financial", label: "Financial", icon: PiggyBank, color: "#22C55E" },
  { value: "fitness", label: "Fitness", icon: Dumbbell, color: "#EF4444" },
  { value: "learning", label: "Learning", icon: GraduationCap, color: "#3B82F6" },
  { value: "career", label: "Career", icon: Briefcase, color: "#8B5CF6" },
  { value: "health", label: "Health", icon: Heart, color: "#EC4899" },
  { value: "reading", label: "Reading", icon: BookOpen, color: "#F59E0B" },
  { value: "creative", label: "Creative", icon: Palette, color: "#06B6D4" },
  { value: "travel", label: "Travel", icon: Plane, color: "#10B981" },
  { value: "social", label: "Social", icon: Users, color: "#6366F1" },
  { value: "wellness", label: "Wellness", icon: Leaf, color: "#84CC16" },
  { value: "other", label: "Other", icon: Star, color: "#A855F7" },
];

const GOAL_UNITS = [
  { value: "$", label: "$" },
  { value: "€", label: "€" },
  { value: "£", label: "£" },
  { value: "hrs", label: "Hours" },
  { value: "days", label: "Days" },
  { value: "km", label: "Km" },
  { value: "mi", label: "Miles" },
  { value: "lbs", label: "Lbs" },
  { value: "kg", label: "Kg" },
  { value: "x", label: "Times" },
  { value: "pages", label: "Pages" },
  { value: "items", label: "Items" },
];

const TIMEFRAME_OPTIONS = [
  { value: "daily", label: "Daily", description: "Reset every day" },
  { value: "weekly", label: "Weekly", description: "Reset every week" },
  { value: "monthly", label: "Monthly", description: "Reset every month" },
  { value: "custom", label: "Custom", description: "Set your own deadline" },
];

function CategoryCard({
  category,
  isSelected,
  onSelect,
}: {
  category: typeof GOAL_CATEGORIES[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = category.icon;

  return (
    <Pressable onPress={onSelect}>
      {({ pressed }) => (
        <MotiView
          animate={{ scale: pressed ? 0.95 : 1 }}
          transition={{ type: "timing", duration: 100 }}
        >
          <View
            className={`w-20 h-20 rounded-2xl items-center justify-center mr-3 ${
              isSelected ? "border-2" : ""
            }`}
            style={{
              backgroundColor: category.color + (isSelected ? "30" : "15"),
              borderColor: isSelected ? category.color : "transparent",
            }}
          >
            <Icon size={28} color={category.color} />
            <Text
              className="text-xs mt-1 font-medium"
              style={{ color: category.color }}
            >
              {category.label}
            </Text>
          </View>
        </MotiView>
      )}
    </Pressable>
  );
}

export default function NewGoalScreen() {
  const { createGoal, isLoading } = useGoals();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [unit, setUnit] = useState("$");
  const [category, setCategory] = useState("financial");
  const [timeframe, setTimeframe] = useState("monthly");
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split("T")[0];
  });

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");
  const successColor = useThemeColor("success");

  const selectedCategory = GOAL_CATEGORIES.find((c) => c.value === category);

  const handleCreate = async () => {
    if (!title.trim() || !targetValue) return;

    await createGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      targetValue: parseFloat(targetValue),
      unit,
      category,
      timeframe,
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
      <Container>
        <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        <FadeIn>
          <View className="py-6">
            <Text className="text-2xl font-bold text-foreground mb-1">
              New Goal
            </Text>
            <Text className="text-muted text-sm">
              Set a goal and track your progress
            </Text>
          </View>
        </FadeIn>

        {/* Category Selection */}
        <SlideIn delay={50}>
          <Text className="text-foreground font-medium mb-3">
            Choose Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
            {GOAL_CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.value}
                category={cat}
                isSelected={category === cat.value}
                onSelect={() => setCategory(cat.value)}
              />
            ))}
          </ScrollView>
        </SlideIn>

        {/* Title */}
        <SlideIn delay={100}>
          <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
            <View className="flex-row items-center mb-2">
              <Target size={18} color={selectedCategory?.color || accentColor} />
              <Text className="text-foreground font-medium ml-2">
                Goal Title *
              </Text>
            </View>
            <TextInput
              placeholder="e.g., Save $500 this month"
              value={title}
              onChangeText={setTitle}
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
              placeholder="Add more details about your goal..."
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

        {/* Timeframe */}
        <SlideIn delay={200}>
          <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
            <View className="flex-row items-center mb-3">
              <Clock size={18} color={accentColor} />
              <Text className="text-foreground font-medium ml-2">Timeframe</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {TIMEFRAME_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => setTimeframe(option.value)}
                >
                  <MotiView
                    animate={{
                      backgroundColor: timeframe === option.value ? accentColor : "transparent",
                    }}
                    transition={{ type: "timing", duration: 150 }}
                    className={`px-4 py-2 rounded-xl border ${
                      timeframe === option.value ? "border-transparent" : "border-muted/30"
                    }`}
                  >
                    <Text
                      className={`font-medium text-sm ${
                        timeframe === option.value ? "text-white" : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </MotiView>
                </Pressable>
              ))}
            </View>
          </Surface>
        </SlideIn>

        {/* Target Value & Unit */}
        <SlideIn delay={250}>
          <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
            <View className="flex-row items-center mb-3">
              <DollarSign size={18} color={successColor} />
              <Text className="text-foreground font-medium ml-2">
                Target Value *
              </Text>
            </View>
            <View className="flex-row gap-3 mb-3">
              <TextInput
                placeholder="500"
                value={targetValue}
                onChangeText={setTargetValue}
                keyboardType="numeric"
                placeholderTextColor={mutedColor}
                className="bg-muted/10 p-3 rounded-xl text-foreground flex-1"
                style={{ color: foregroundColor }}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View className="flex-row gap-2">
                {GOAL_UNITS.map((u) => (
                  <Pressable
                    key={u.value}
                    onPress={() => setUnit(u.value)}
                  >
                    <MotiView
                      animate={{
                        backgroundColor: unit === u.value ? accentColor : "transparent",
                      }}
                      transition={{ type: "timing", duration: 150 }}
                      className={`px-3 py-2 rounded-lg border ${
                        unit === u.value ? "border-transparent" : "border-muted/30"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          unit === u.value ? "text-white font-medium" : "text-muted"
                        }`}
                      >
                        {u.value}
                      </Text>
                    </MotiView>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </Surface>
        </SlideIn>

        {/* End Date (only for custom timeframe) */}
        {timeframe === "custom" && (
          <SlideIn delay={300}>
            <Surface variant="secondary" className="p-4 rounded-2xl mb-4">
              <View className="flex-row items-center mb-2">
                <Calendar size={18} color={accentColor} />
                <Text className="text-foreground font-medium ml-2">
                  Target Date *
                </Text>
              </View>
              <TextInput
                placeholder="YYYY-MM-DD"
                value={endDate}
                onChangeText={setEndDate}
                placeholderTextColor={mutedColor}
                className="bg-muted/10 p-3 rounded-xl text-foreground"
                style={{ color: foregroundColor }}
              />
              <Text className="text-muted text-xs mt-2">
                Format: YYYY-MM-DD (e.g., 2026-02-15)
              </Text>
            </Surface>
          </SlideIn>
        )}

        {/* Preview */}
        <SlideIn delay={350}>
          <Text className="text-muted text-sm mb-3">Preview</Text>
          <Surface variant="tertiary" className="p-4 rounded-2xl mb-4">
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: (selectedCategory?.color || accentColor) + "20" }}
              >
                {selectedCategory && (
                  <selectedCategory.icon size={24} color={selectedCategory.color} />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">
                  {title || "Goal Title"}
                </Text>
                <Text className="text-muted text-xs">
                  {targetValue ? `${targetValue} ${unit}` : "Target value"} • {
                    TIMEFRAME_OPTIONS.find((t) => t.value === timeframe)?.label
                  }
                </Text>
              </View>
            </View>
          </Surface>
        </SlideIn>

        {/* Create Button */}
        <SlideIn delay={400}>
          <Button
            size="lg"
            onPress={handleCreate}
            isDisabled={!isValid || isLoading}
            className="mb-8"
          >
            <Target size={18} color="white" />
            <Button.Label className="ml-2">
              {isLoading ? "Creating..." : "Create Goal"}
            </Button.Label>
          </Button>
        </SlideIn>
        </ScrollView>
      </Container>
    </>
  );
}
