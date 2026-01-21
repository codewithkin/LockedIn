import { MotiView } from "moti";
import { Stack, useLocalSearchParams, router, Link } from "expo-router";
import { Button, Surface, Chip, Divider, useThemeColor } from "heroui-native";
import {
  Target,
  TrendingUp,
  CheckCircle,
  Calendar,
  ArrowLeft,
  Plus,
  Image,
  Trash2,
  Clock,
  Award,
} from "lucide-react-native";
import { Text, View, Alert, Image as RNImage, Pressable } from "react-native";
import { useMemo } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, AnimatedProgressBar } from "@/components/animations";
import { useGoals } from "@/hooks/use-data";
import { scheduleGoalCompletionNotification } from "@/lib/notifications";

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals, deleteGoal } = useGoals();

  const foregroundColor = useThemeColor("foreground");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const dangerColor = useThemeColor("danger");
  const mutedColor = useThemeColor("muted");

  const goal = useMemo(() => goals.find((g) => g.id === id), [goals, id]);

  if (!goal) {
    return (
      <>
        <Stack.Screen options={{ title: "Goal Not Found" }} />
        <Container className="p-4 items-center justify-center">
          <Text className="text-foreground text-lg">Goal not found</Text>
          <Button onPress={() => router.back()} className="mt-4">
            <Button.Label>Go Back</Button.Label>
          </Button>
        </Container>
      </>
    );
  }

  const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  const handleDelete = () => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteGoal(goal.id);
            router.back();
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: goal.title,
          headerRight: () => (
            <Pressable onPress={handleDelete} className="mr-2">
              <Trash2 size={20} color={dangerColor} />
            </Pressable>
          ),
        }}
      />
      <Container className="p-4">
        {/* Goal Header */}
        <FadeIn>
          <Surface variant="secondary" className="p-5 rounded-xl mb-4">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 mr-3">
                <View className="flex-row items-center mb-2">
                  {goal.isSurpassed ? (
                    <Award size={24} color={warningColor} />
                  ) : goal.isCompleted ? (
                    <CheckCircle size={24} color={successColor} />
                  ) : (
                    <Target size={24} color={foregroundColor} />
                  )}
                  <Text className="text-foreground font-bold text-xl ml-2">
                    {goal.title}
                  </Text>
                </View>
                {goal.description && (
                  <Text className="text-muted text-sm">{goal.description}</Text>
                )}
              </View>
              <Chip
                size="md"
                color={
                  goal.isSurpassed
                    ? "warning"
                    : goal.isCompleted
                    ? "success"
                    : daysRemaining <= 3
                    ? "danger"
                    : "default"
                }
                variant="flat"
              >
                <Chip.Label>
                  {goal.isSurpassed
                    ? "Surpassed!"
                    : goal.isCompleted
                    ? "Completed"
                    : `${daysRemaining}d left`}
                </Chip.Label>
              </Chip>
            </View>

            {/* Progress Section */}
            <View className="mb-4">
              <View className="flex-row items-baseline justify-between mb-2">
                <Text className="text-foreground font-bold text-3xl">
                  {goal.unit === "$"
                    ? `$${goal.currentValue.toLocaleString()}`
                    : `${goal.currentValue.toLocaleString()}`}
                </Text>
                <Text className="text-muted text-base">
                  of{" "}
                  {goal.unit === "$"
                    ? `$${goal.targetValue.toLocaleString()}`
                    : `${goal.targetValue.toLocaleString()} ${goal.unit}`}
                </Text>
              </View>
              <AnimatedProgressBar
                progress={progress}
                height={12}
                isSurpassed={goal.isSurpassed}
              />
              <Text className="text-muted text-xs mt-2 text-center">
                {progress}% {goal.isSurpassed ? "(Surpassed target!)" : "complete"}
              </Text>
            </View>

            {/* Meta Info */}
            <Divider className="my-3" />
            <View className="flex-row justify-between">
              <View className="flex-row items-center">
                <Calendar size={14} color={mutedColor} />
                <Text className="text-muted text-xs ml-1">
                  {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                </Text>
              </View>
              {goal.category && (
                <Chip size="sm" variant="flat">
                  <Chip.Label className="capitalize">{goal.category}</Chip.Label>
                </Chip>
              )}
            </View>
          </Surface>
        </FadeIn>

        {/* Add Progress Button */}
        {!goal.isCompleted && (
          <SlideIn delay={100}>
            <Link href={`/goal/update/${goal.id}`} asChild>
              <Button size="lg" className="mb-6">
                <Plus size={18} color="white" />
                <Button.Label className="ml-2">Log Progress</Button.Label>
              </Button>
            </Link>
          </SlideIn>
        )}

        {/* Updates Timeline */}
        <SlideIn delay={200}>
          <Text className="text-foreground font-semibold text-lg mb-3">
            Progress Updates ({goal.updates.length})
          </Text>
        </SlideIn>

        {goal.updates.length > 0 ? (
          goal.updates
            .slice()
            .reverse()
            .map((update, index) => (
              <SlideIn key={update.id} delay={250 + index * 50}>
                <Surface variant="secondary" className="p-4 rounded-xl mb-3">
                  <View className="flex-row items-start">
                    {/* Timeline dot */}
                    <View className="mr-3 items-center">
                      <View className="w-3 h-3 rounded-full bg-success" />
                      {index < goal.updates.length - 1 && (
                        <View className="w-0.5 flex-1 bg-muted/30 mt-1" />
                      )}
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-foreground font-semibold">
                          +{goal.unit === "$" ? "$" : ""}
                          {update.amount.toLocaleString()}
                          {goal.unit !== "$" ? ` ${goal.unit}` : ""}
                        </Text>
                        <View className="flex-row items-center">
                          <Clock size={12} color={mutedColor} />
                          <Text className="text-muted text-xs ml-1">
                            {formatDate(update.createdAt)}
                          </Text>
                        </View>
                      </View>

                      {update.note && (
                        <Text className="text-muted text-sm mb-2">
                          {update.note}
                        </Text>
                      )}

                      {update.proofUrl && (
                        <View className="mt-2">
                          <View className="flex-row items-center mb-2">
                            <Image size={14} color={successColor} />
                            <Text className="text-success text-xs ml-1 font-medium">
                              Proof attached
                            </Text>
                          </View>
                          <RNImage
                            source={{ uri: update.proofUrl }}
                            className="w-full h-40 rounded-lg"
                            resizeMode="cover"
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </Surface>
              </SlideIn>
            ))
        ) : (
          <SlideIn delay={250}>
            <Surface
              variant="secondary"
              className="p-6 rounded-xl items-center"
            >
              <TrendingUp size={32} color={mutedColor} />
              <Text className="text-muted text-sm mt-2 text-center">
                No updates yet. Log your first progress!
              </Text>
            </Surface>
          </SlideIn>
        )}
      </Container>
    </>
  );
}
