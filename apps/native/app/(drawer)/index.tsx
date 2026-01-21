import { MotiView } from "moti";
import { Link } from "expo-router";
import { Button, Surface, Chip, Divider, useThemeColor, Card } from "heroui-native";
import {
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Flame,
  Award,
  Calendar,
  Plus,
  Bell,
  ChevronRight,
  BarChart3,
  Zap,
} from "lucide-react-native";
import { Text, View, Pressable, useWindowDimensions, ScrollView } from "react-native";
import { useState, useMemo } from "react";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, ScaleIn, AnimatedProgressBar } from "@/components/animations";
import { useGoals, useGroups } from "@/hooks/use-data";
import { useAuth } from "@/contexts/auth-context";

// Quick Action Button Component
function QuickActionButton({
  href,
  icon: Icon,
  label,
  color,
  bgColor,
  delay = 0,
}: {
  href: any;
  icon: any;
  label: string;
  color: string;
  bgColor: string;
  delay?: number;
}) {
  return (
    <Link href={href} asChild>
      <Pressable className="flex-1">
        {({ pressed }) => (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: pressed ? 0.95 : 1 }}
            transition={{ type: "spring", delay }}
          >
            <Surface
              variant="secondary"
              className="p-4 rounded-2xl flex-row items-center justify-center gap-3 border border-transparent active:border-accent/30"
            >
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: bgColor }}
              >
                <Icon size={20} color={color} />
              </View>
              <Text className="text-foreground font-semibold text-sm flex-1">
                {label}
              </Text>
              <ChevronRight size={16} color={color} />
            </Surface>
          </MotiView>
        )}
      </Pressable>
    </Link>
  );
}

// Stat Card Component
function StatCard({
  value,
  label,
  icon: Icon,
  iconColor,
  iconBgColor,
  trend,
  delay = 0,
}: {
  value: number;
  label: string;
  icon: any;
  iconColor: string;
  iconBgColor: string;
  trend?: number;
  delay?: number;
}) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay }}
      className="flex-1"
    >
      <Surface variant="secondary" className="p-4 rounded-2xl">
        <View className="flex-row items-center justify-between mb-3">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: iconBgColor }}
          >
            <Icon size={20} color={iconColor} />
          </View>
          {trend !== undefined && (
            <Chip size="sm" color={trend >= 0 ? "success" : "danger"}>
              <Chip.Label>
                {trend >= 0 ? "+" : ""}
                {trend}%
              </Chip.Label>
            </Chip>
          )}
        </View>
        <Text className="text-foreground font-bold text-2xl">{value}</Text>
        <Text className="text-muted text-xs mt-1">{label}</Text>
      </Surface>
    </MotiView>
  );
}

// Goal Progress Card
function GoalProgressCard({
  goal,
  foregroundColor,
  index = 0,
}: {
  goal: any;
  foregroundColor: string;
  index?: number;
}) {
  const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
  const daysRemaining = Math.max(
    0,
    Math.ceil((new Date(goal.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <SlideIn delay={index * 80}>
      <Link href={`/goal/${goal.id}`} asChild>
        <Pressable>
          {({ pressed }) => (
            <MotiView
              animate={{ scale: pressed ? 0.98 : 1 }}
              transition={{ type: "timing", duration: 100 }}
            >
              <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 mr-3">
                    <Text className="text-foreground font-semibold text-base">
                      {goal.title}
                    </Text>
                    {goal.description && (
                      <Text className="text-muted text-xs mt-0.5" numberOfLines={1}>
                        {goal.description}
                      </Text>
                    )}
                  </View>
                  <Chip
                    size="sm"
                    color={goal.isCompleted ? "success" : daysRemaining <= 3 ? "danger" : "default"}
                  >
                    <Chip.Label>
                      {goal.isCompleted ? "Done" : `${daysRemaining}d`}
                    </Chip.Label>
                  </Chip>
                </View>

                <View className="mb-2">
                  <AnimatedProgressBar
                    progress={progress}
                    isSurpassed={goal.isSurpassed}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="text-muted text-xs">
                    {goal.unit === "$" ? `$${goal.currentValue}` : goal.currentValue} /{" "}
                    {goal.unit === "$" ? `$${goal.targetValue}` : `${goal.targetValue} ${goal.unit}`}
                  </Text>
                  <Text className="text-accent text-xs font-medium">{progress}%</Text>
                </View>
              </Surface>
            </MotiView>
          )}
        </Pressable>
      </Link>
    </SlideIn>
  );
}

export default function Home() {
  const { goals, isLoading: goalsLoading } = useGoals();
  const { groups } = useGroups();
  const { user } = useAuth();
  const layout = useWindowDimensions();

  const foregroundColor = useThemeColor("foreground");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const accentColor = useThemeColor("accent");
  const dangerColor = useThemeColor("danger");
  const mutedColor = useThemeColor("muted");
  const backgroundColor = useThemeColor("background");

  // Responsive breakpoints
  const isTablet = layout.width >= 768;
  const isLargePhone = layout.width >= 414;

  // Stats
  const activeGoals = useMemo(() => goals.filter((g) => !g.isCompleted), [goals]);
  const completedGoals = useMemo(() => goals.filter((g) => g.isCompleted), [goals]);
  const surpassedGoals = useMemo(() => goals.filter((g) => g.isSurpassed), [goals]);
  const totalUpdates = useMemo(
    () => goals.reduce((acc, g) => acc + g.updates.length, 0),
    [goals]
  );

  // Tab state for goals
  const [tabIndex, setTabIndex] = useState(0);
  const [routes] = useState([
    { key: "active", title: "Active" },
    { key: "completed", title: "Completed" },
  ]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.name?.split(" ")[0] || "there";

  // Tab content
  const renderTabContent = (key: string) => {
    const goalsToShow = key === "active" ? activeGoals : completedGoals;

    if (goalsToShow.length === 0) {
      return (
        <Surface variant="tertiary" className="p-6 rounded-2xl items-center mt-3">
          <Target size={32} color={mutedColor} />
          <Text className="text-muted text-sm mt-2">
            {key === "active" ? "No active goals" : "No completed goals yet"}
          </Text>
        </Surface>
      );
    }

    return (
      <View className="mt-3">
        {goalsToShow.slice(0, 3).map((goal, index) => (
          <GoalProgressCard
            key={goal.id}
            goal={goal}
            foregroundColor={foregroundColor}
            index={index}
          />
        ))}
        {goalsToShow.length > 3 && (
          <Link href="/(drawer)/(tabs)" asChild>
            <Button size="sm" variant="ghost" className="mt-2">
              <Button.Label>View all {goalsToShow.length} goals</Button.Label>
              <ArrowRight size={14} color={foregroundColor} />
            </Button>
          </Link>
        )}
      </View>
    );
  };

  return (
    <Container className="px-4 md:px-6 lg:px-8">
      {/* Header */}
      <FadeIn>
        <View className="py-6 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-muted text-sm">{getGreeting()}</Text>
            <Text className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {userName} 👋
            </Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable className="w-10 h-10 rounded-full bg-muted/20 items-center justify-center">
              <Bell size={20} color={foregroundColor} />
            </Pressable>
          </View>
        </View>
      </FadeIn>

      {/* Summary Card - Like the profit card in reference */}
      <SlideIn delay={100}>
        <Surface
          variant="secondary"
          className="p-5 rounded-3xl mb-6 overflow-hidden"
          style={{ backgroundColor: accentColor }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white/80 text-sm font-medium">Goal Progress</Text>
            <Chip size="sm" className="bg-white/20">
              <Chip.Label className="text-white">This Month</Chip.Label>
            </Chip>
          </View>
          <Text className="text-white font-bold text-4xl mb-1">
            {completedGoals.length}
            <Text className="text-xl font-normal"> / {goals.length}</Text>
          </Text>
          <Text className="text-white/70 text-sm mb-4">Goals completed</Text>

          {/* Mini chart visualization */}
          <View className="flex-row items-end gap-1 h-12">
            {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
              <MotiView
                key={i}
                from={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ type: "timing", duration: 600, delay: 200 + i * 50 }}
                className="flex-1 bg-white/30 rounded-sm"
              />
            ))}
          </View>
        </Surface>
      </SlideIn>

      {/* Stats Grid */}
      <SlideIn delay={200}>
        <View className={`flex-row gap-3 mb-6 ${isTablet ? "flex-wrap" : ""}`}>
          <StatCard
            value={activeGoals.length}
            label="Active Goals"
            icon={Flame}
            iconColor={warningColor}
            iconBgColor={warningColor + "20"}
            delay={250}
          />
          <StatCard
            value={surpassedGoals.length}
            label="Surpassed"
            icon={TrendingUp}
            iconColor={successColor}
            iconBgColor={successColor + "20"}
            trend={surpassedGoals.length > 0 ? 15 : undefined}
            delay={300}
          />
          {(isTablet || isLargePhone) && (
            <StatCard
              value={totalUpdates}
              label="Total Updates"
              icon={BarChart3}
              iconColor={accentColor}
              iconBgColor={accentColor + "20"}
              delay={350}
            />
          )}
        </View>
      </SlideIn>

      {/* Quick Actions - More button-like */}
      <SlideIn delay={300}>
        <Text className="text-foreground font-semibold text-lg mb-3">Quick Actions</Text>
        <View className={`gap-3 mb-6 ${isTablet ? "flex-row" : ""}`}>
          <QuickActionButton
            href="/goal/new"
            icon={Target}
            label="Create Goal"
            color={accentColor}
            bgColor={accentColor + "20"}
            delay={350}
          />
          <QuickActionButton
            href="/group/new"
            icon={Users}
            label="New Group"
            color={successColor}
            bgColor={successColor + "20"}
            delay={400}
          />
          <QuickActionButton
            href="/group/join"
            icon={Zap}
            label="Join Group"
            color={warningColor}
            bgColor={warningColor + "20"}
            delay={450}
          />
        </View>
      </SlideIn>

      {/* Goals Section with Tabs */}
      <SlideIn delay={400}>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-foreground font-semibold text-lg">Your Goals</Text>
          <Link href="/(drawer)/(tabs)" asChild>
            <Button size="sm" variant="ghost">
              <Button.Label>See All</Button.Label>
              <ArrowRight size={14} color={foregroundColor} />
            </Button>
          </Link>
        </View>

        {/* Custom Tab Bar */}
        <View className="flex-row bg-muted/20 rounded-xl p-1 mb-1">
          {routes.map((route, index) => (
            <Pressable
              key={route.key}
              onPress={() => setTabIndex(index)}
              className={`flex-1 py-2 px-4 rounded-lg ${
                tabIndex === index ? "bg-background" : ""
              }`}
            >
              <Text
                className={`text-center font-medium text-sm ${
                  tabIndex === index ? "text-foreground" : "text-muted"
                }`}
              >
                {route.title}
              </Text>
            </Pressable>
          ))}
        </View>

        {renderTabContent(routes[tabIndex].key)}
      </SlideIn>

      {/* Groups Overview */}
      <SlideIn delay={500}>
        <View className="flex-row items-center justify-between mb-3 mt-6">
          <Text className="text-foreground font-semibold text-lg">Your Groups</Text>
          <Link href="/(drawer)/(tabs)/two" asChild>
            <Button size="sm" variant="ghost">
              <Button.Label>View All</Button.Label>
              <ArrowRight size={14} color={foregroundColor} />
            </Button>
          </Link>
        </View>

        {groups.length > 0 ? (
          <Surface variant="secondary" className="p-4 rounded-2xl">
            {groups.slice(0, 3).map((group, index) => (
              <View key={group.id}>
                <Link href={`/group/${group.id}`} asChild>
                  <Pressable className="flex-row items-center py-3">
                    <View className="w-12 h-12 rounded-xl bg-accent/20 items-center justify-center mr-3">
                      <Users size={22} color={accentColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-semibold">{group.name}</Text>
                      <Text className="text-muted text-xs">
                        {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                      </Text>
                    </View>
                    <ChevronRight size={18} color={mutedColor} />
                  </Pressable>
                </Link>
                {index < Math.min(groups.length, 3) - 1 && <Divider className="my-1" />}
              </View>
            ))}
          </Surface>
        ) : (
          <Surface variant="secondary" className="p-8 rounded-2xl items-center">
            <View className="w-16 h-16 rounded-2xl bg-muted/20 items-center justify-center mb-3">
              <Users size={32} color={mutedColor} />
            </View>
            <Text className="text-foreground font-semibold mb-1">No groups yet</Text>
            <Text className="text-muted text-sm text-center mb-4">
              Join or create a group for accountability
            </Text>
            <View className="flex-row gap-3">
              <Link href="/group/new" asChild>
                <Button size="sm">
                  <Plus size={16} color="white" />
                  <Button.Label className="ml-1">Create</Button.Label>
                </Button>
              </Link>
              <Link href="/group/join" asChild>
                <Button size="sm" variant="secondary">
                  <Button.Label>Join</Button.Label>
                </Button>
              </Link>
            </View>
          </Surface>
        )}
      </SlideIn>

      {/* Bottom spacing */}
      <View className="h-8" />
    </Container>
  );
}
