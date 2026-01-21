import { MotiView } from "moti";
import { Link } from "expo-router";
import { Surface, Chip, useThemeColor } from "heroui-native";
import { Target, TrendingUp, CheckCircle, Calendar, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import type { Goal } from "@/types";
import { AnimatedProgressBar, SlideIn } from "./animations";

interface GoalCardProps {
  goal: Goal;
  index?: number;
}

export function GoalCard({ goal, index = 0 }: GoalCardProps) {
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");

  const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  const getStatusColor = () => {
    if (goal.isSurpassed) return "warning";
    if (goal.isCompleted) return "success";
    if (daysRemaining <= 3) return "danger";
    return "default";
  };

  const getStatusText = () => {
    if (goal.isSurpassed) return "Surpassed!";
    if (goal.isCompleted) return "Completed";
    if (daysRemaining === 0) return "Due today";
    if (daysRemaining <= 3) return `${daysRemaining}d left`;
    return `${daysRemaining} days`;
  };

  return (
    <SlideIn delay={index * 80}>
      <Link href={`/goal/${goal.id}`} asChild>
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
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center mb-1">
                      {goal.isSurpassed ? (
                        <TrendingUp size={16} color={warningColor} />
                      ) : goal.isCompleted ? (
                        <CheckCircle size={16} color={successColor} />
                      ) : (
                        <Target size={16} color={foregroundColor} />
                      )}
                      <Text className="text-foreground font-semibold text-base ml-2">
                        {goal.title}
                      </Text>
                    </View>
                    {goal.description && (
                      <Text className="text-muted text-xs" numberOfLines={1}>
                        {goal.description}
                      </Text>
                    )}
                  </View>
                  <Chip
                    size="sm"
                    color={getStatusColor()}
                  >
                    <Chip.Label>{getStatusText()}</Chip.Label>
                  </Chip>
                </View>

                <View className="mb-3">
                  <View className="flex-row items-baseline justify-between mb-2">
                    <Text className="text-foreground font-bold text-lg">
                      {goal.unit === "$" ? `$${goal.currentValue.toLocaleString()}` : `${goal.currentValue.toLocaleString()} ${goal.unit}`}
                    </Text>
                    <Text className="text-muted text-sm">
                      of {goal.unit === "$" ? `$${goal.targetValue.toLocaleString()}` : `${goal.targetValue.toLocaleString()} ${goal.unit}`}
                    </Text>
                  </View>
                  <AnimatedProgressBar
                    progress={progress}
                    isSurpassed={goal.isSurpassed}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Calendar size={14} color={mutedColor} />
                    <Text className="text-muted text-xs ml-1">
                      {goal.updates.length} update{goal.updates.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-accent text-xs font-medium mr-1">
                      View details
                    </Text>
                    <ChevronRight size={14} color={foregroundColor} />
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
