import { View, Text, ScrollView } from "react-native";
import { Medal } from "lucide-react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useThemeColor } from "heroui-native";

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatarUrl?: string;
  completedGoals?: number;
  completionPercentage?: number;
  contributions?: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  title?: string;
  isLoading?: boolean;
  entityType?: "global" | "goal" | "gang" | "group"; // To determine what metric to show
}

export function Leaderboard({
  users,
  title = "Leaderboard",
  isLoading = false,
  entityType = "global",
}: LeaderboardProps) {
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="py-8">
          <Text className="text-center text-muted">Loading leaderboard...</Text>
        </CardContent>
      </Card>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="py-8">
          <Text className="text-center text-muted">No users yet</Text>
        </CardContent>
      </Card>
    );
  }

  // Get the top user (rank 1)
  const topUser = users[0];
  const otherUsers = users.slice(1);

  // Helper function to get metric label based on entity type
  const getMetricLabel = () => {
    switch (entityType) {
      case "goal":
        return "contributions";
      case "gang":
      case "group":
        return "contributions";
      default:
        return "goals completed";
    }
  };

  // Helper function to get metric value
  const getMetricValue = (user: LeaderboardUser) => {
    switch (entityType) {
      case "goal":
      case "gang":
      case "group":
        return user.contributions || 0;
      default:
        return user.completedGoals || 0;
    }
  };

  // Helper function to get display percentage
  const getDisplayValue = (user: LeaderboardUser) => {
    switch (entityType) {
      case "goal":
      case "gang":
      case "group":
        return `${user.contributions || 0}`;
      default:
        return `${user.completionPercentage || 0}%`;
    }
  };

  return (
    <View className="mb-6">
      {/* Title */}
      <View className="flex-row items-center gap-2 mb-4 px-4 sm:px-6">
        <Medal size={24} color={accentColor} />
        <Text className="text-lg sm:text-xl font-bold text-foreground">{title}</Text>
      </View>

      {/* Top User Card */}
      {topUser && (
        <Card className="mb-4 light:bg-gradient-to-br light:from-blue-50 light:to-blue-100 dark:bg-gradient-to-br dark:from-blue-900/30 dark:to-blue-800/20">
          <CardContent className="py-6 sm:py-8 px-4 sm:px-6">
            <View className="items-center">
              {/* Crown Badge */}
              <View className="mb-4">
                <Text style={{ fontSize: 32 }}>👑</Text>
              </View>

              {/* Avatar */}
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mb-3">
                <AvatarImage source={{ uri: topUser.avatarUrl }} />
                <AvatarFallback>
                  <Text className="text-sm font-bold">{topUser.name.charAt(0).toUpperCase()}</Text>
                </AvatarFallback>
              </Avatar>

              {/* Name */}
              <Text className="text-lg sm:text-2xl font-bold text-foreground text-center mb-2">
                {topUser.name}
              </Text>

              {/* Completion Percentage */}
              <Badge className="light:bg-green-100 dark:bg-green-900/40 mb-4">
                <Text className="light:text-green-700 dark:text-green-300 font-semibold">
                  {getDisplayValue(topUser)} {entityType === "global" ? "completed" : ""}
                </Text>
              </Badge>

              {/* Metric */}
              <Text className="text-xs sm:text-sm light:text-gray-600 dark:text-gray-400 text-center">
                {getMetricLabel()}
              </Text>
            </View>
          </CardContent>
        </Card>
      )}

      {/* Other Users */}
      {otherUsers.length > 0 && (
        <View className="gap-2 sm:gap-3">
          {otherUsers.map((user, index) => (
            <Card key={user.id} className="light:bg-white dark:bg-slate-800">
              <CardContent className="py-3 sm:py-4 px-4 sm:px-6">
                <View className="flex-row items-center gap-3 sm:gap-4">
                  {/* Rank Badge */}
                  <Badge className="light:bg-gray-200 dark:bg-gray-700 min-w-[40px] justify-center">
                    <Text className="light:text-gray-900 dark:text-gray-100 font-bold text-sm">
                      {user.rank}
                    </Text>
                  </Badge>

                  {/* Avatar */}
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                    <AvatarImage source={{ uri: user.avatarUrl }} />
                    <AvatarFallback>
                      <Text className="text-xs font-bold">{user.name.charAt(0).toUpperCase()}</Text>
                    </AvatarFallback>
                  </Avatar>

                  {/* Name and Info */}
                  <View className="flex-1">
                    <Text className="text-sm sm:text-base font-semibold text-foreground">
                      {user.name}
                    </Text>
                    <Text className="text-xs sm:text-sm light:text-gray-600 dark:text-gray-400">
                      {getDisplayValue(user)} {entityType === "global" ? "completed" : ""}
                    </Text>
                  </View>

                  {/* Metric Value */}
                  <Text className="text-sm sm:text-base font-semibold text-accent">
                    {getDisplayValue(user)}
                  </Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}
