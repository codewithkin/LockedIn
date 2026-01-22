import { Link } from "expo-router";
import { useThemeColor } from "heroui-native";
import { Calendar, MessageCircle2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Goal } from "@/lib/api";

interface GoalCardProps {
  goal: Goal;
  index?: number;
}

export function GoalCard({ goal, index = 0 }: GoalCardProps) {
  const accentColor = useThemeColor("accent");
  const progress = Math.round((goal.currentValue / goal.targetValue) * 100);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Determine status badge color
  const getStatusColor = () => {
    if (goal.isSurpassed) return "light:bg-purple-100 dark:bg-purple-900/40";
    if (goal.isCompleted) return "light:bg-green-100 dark:bg-green-900/40";
    return "light:bg-orange-100 dark:bg-orange-900/40";
  };

  const getStatusTextColor = () => {
    if (goal.isSurpassed) return "light:text-purple-700 dark:text-purple-300";
    if (goal.isCompleted) return "light:text-green-700 dark:text-green-300";
    return "light:text-orange-700 dark:text-orange-300";
  };

  const status = goal.isSurpassed
    ? "Surpassed"
    : goal.isCompleted
    ? "Completed"
    : "In Progress";

  return (
    <Link href={`/goal/${goal.id}`} asChild>
      <Pressable>
        <Card className="light:bg-white dark:bg-slate-800 mb-3 sm:mb-4">
          <CardContent className="py-3 sm:py-4 px-4 sm:px-6">
            <View className="gap-3">
              {/* Header: Title and Status */}
              <View className="flex-row items-start justify-between gap-2">
                <Text
                  className="flex-1 text-sm sm:text-base font-semibold text-foreground"
                  numberOfLines={2}
                >
                  {goal.title}
                </Text>
                <Badge className={getStatusColor()}>
                  <Text className={`text-xs font-semibold ${getStatusTextColor()}`}>
                    {status}
                  </Text>
                </Badge>
              </View>

              {/* Progress Bar */}
              <View>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-xs sm:text-sm text-foreground font-medium">
                    {goal.currentValue} / {goal.targetValue} {goal.unit}
                  </Text>
                  <Text className="text-xs sm:text-sm font-semibold text-accent">
                    {progress}%
                  </Text>
                </View>
                <View className="h-2 sm:h-3 light:bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View
                    className="h-full light:bg-blue-500 dark:bg-blue-600 rounded-full"
                    style={{
                      width: `${Math.min(100, progress)}%`,
                    }}
                  />
                </View>
              </View>

              {/* Meta Information: Date and Updates */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  <Calendar size={14} color={accentColor} />
                  <Text className="text-xs sm:text-sm light:text-gray-600 dark:text-gray-400">
                    {formatDate(goal.startDate)}
                  </Text>
                </View>
                {goal.updates && goal.updates.length > 0 && (
                  <View className="flex-row items-center gap-1">
                    <MessageCircle2 size={14} color={accentColor} />
                    <Text className="text-xs sm:text-sm light:text-gray-600 dark:text-gray-400">
                      {goal.updates.length} update{goal.updates.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    </Link>
  );
}
