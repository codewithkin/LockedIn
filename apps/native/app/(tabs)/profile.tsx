import { MotiView } from "moti";
import { router } from "expo-router";
import { Surface, Button, useThemeColor, Input } from "heroui-native";
import {
  User,
  Mail,
  Edit3,
  Check,
  X,
  Globe,
  Lock,
  Users,
  Target,
  Trophy,
  LogOut,
  Camera,
  ChevronRight,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput, Image, Switch, Alert } from "react-native";
import { useState } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { useAuth } from "@/contexts/auth-context";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  index = 0,
  onPress,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  index?: number;
  onPress?: () => void;
}) {
  return (
    <SlideIn delay={index * 50}>
      <Pressable onPress={onPress} disabled={!onPress}>
        <Surface variant="secondary" className="p-4 rounded-2xl items-center flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mb-2"
            style={{ backgroundColor: color + "20" }}
          >
            <Icon size={20} color={color} />
          </View>
          <Text className="text-foreground font-bold text-xl">{value}</Text>
          <Text className="text-muted text-xs mt-0.5">{label}</Text>
        </Surface>
      </Pressable>
    </SlideIn>
  );
}

function EditableField({
  label,
  value,
  onSave,
  icon: Icon,
  placeholder,
  editable = true,
  index = 0,
}: {
  label: string;
  value: string;
  onSave?: (value: string) => void;
  icon: React.ElementType;
  placeholder?: string;
  editable?: boolean;
  index?: number;
}) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const mutedColor = useThemeColor("muted");
  const successColor = useThemeColor("success");

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    onSave?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <SlideIn delay={index * 50}>
      <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
        <View className="flex-row items-center">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mr-4"
            style={{ backgroundColor: accentColor + "15" }}
          >
            <Icon size={20} color={accentColor} />
          </View>
          <View className="flex-1">
            <Text className="text-muted text-xs mb-1">{label}</Text>
            {isEditing ? (
              <TextInput
                value={editValue}
                onChangeText={setEditValue}
                placeholder={placeholder}
                placeholderTextColor={mutedColor}
                className="text-foreground font-medium text-base py-0"
                style={{ color: foregroundColor }}
                autoFocus
              />
            ) : (
              <Text className="text-foreground font-medium text-base">
                {value || <Text className="text-muted">{placeholder}</Text>}
              </Text>
            )}
          </View>
          {editable && (
            <View className="flex-row items-center gap-2">
              {isEditing ? (
                <>
                  <Pressable
                    onPress={handleCancel}
                    className="w-8 h-8 rounded-full items-center justify-center bg-muted/20"
                  >
                    <X size={16} color={mutedColor} />
                  </Pressable>
                  <Pressable
                    onPress={handleSave}
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: successColor }}
                  >
                    <Check size={16} color="white" />
                  </Pressable>
                </>
              ) : (
                <Pressable
                  onPress={() => setIsEditing(true)}
                  className="w-8 h-8 rounded-full items-center justify-center bg-muted/20"
                >
                  <Edit3 size={16} color={mutedColor} />
                </Pressable>
              )}
            </View>
          )}
        </View>
      </Surface>
    </SlideIn>
  );
}

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();

  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const warningColor = useThemeColor("warning");
  const dangerColor = useThemeColor("danger");
  const mutedColor = useThemeColor("muted");

  const [isPublic, setIsPublic] = useState(user?.isPublic ?? true);
  const [displayName, setDisplayName] = useState(user?.name ?? "");

  // Mock stats
  const stats = {
    goals: 12,
    completed: 8,
    gang: 24,
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  const handleSaveName = (name: string) => {
    setDisplayName(name);
    // TODO: Save to backend
  };

  const handleTogglePublic = (value: boolean) => {
    setIsPublic(value);
    // TODO: Save to backend
  };

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Header */}
        <FadeIn>
          <View className="py-6">
            <Text className="text-2xl font-bold text-foreground">Profile</Text>
            <Text className="text-muted text-sm mt-0.5">Manage your account</Text>
          </View>
        </FadeIn>

        {/* Profile Picture */}
        <SlideIn delay={50}>
          <View className="items-center mb-6">
            <Pressable>
              <View className="relative">
                {user?.image ? (
                  <Image
                    source={{ uri: user.image }}
                    className="w-24 h-24 rounded-full"
                    style={{ backgroundColor: mutedColor + "20" }}
                  />
                ) : (
                  <View
                    className="w-24 h-24 rounded-full items-center justify-center"
                    style={{ backgroundColor: accentColor + "20" }}
                  >
                    <User size={40} color={accentColor} />
                  </View>
                )}
                <View
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2 border-background"
                  style={{ backgroundColor: accentColor }}
                >
                  <Camera size={14} color="white" />
                </View>
              </View>
            </Pressable>
            <Text className="text-foreground font-bold text-xl mt-3">
              {displayName || "Set your name"}
            </Text>
            <Text className="text-muted text-sm">{user?.email}</Text>
          </View>
        </SlideIn>

        {/* Stats */}
        <SlideIn delay={100}>
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1">
              <StatCard
                label="Goals"
                value={stats.goals}
                icon={Target}
                color={accentColor}
                index={0}
              />
            </View>
            <View className="flex-1">
              <StatCard
                label="Completed"
                value={stats.completed}
                icon={Trophy}
                color={successColor}
                index={1}
              />
            </View>
            <View className="flex-1">
              <StatCard
                label="Gang"
                value={stats.gang}
                icon={Users}
                color={warningColor}
                index={2}
                onPress={() => router.push("/gang")}
              />
            </View>
          </View>
        </SlideIn>

        {/* Editable Fields */}
        <EditableField
          label="Display Name"
          value={displayName}
          placeholder="Enter your name"
          icon={User}
          onSave={handleSaveName}
          index={3}
        />
        <EditableField
          label="Email"
          value={user?.email || ""}
          icon={Mail}
          editable={false}
          index={4}
        />

        {/* Privacy Toggle */}
        <SlideIn delay={250}>
          <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
            <View className="flex-row items-center">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: isPublic ? successColor + "20" : mutedColor + "20" }}
              >
                {isPublic ? (
                  <Globe size={20} color={successColor} />
                ) : (
                  <Lock size={20} color={mutedColor} />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-medium text-base">Profile Visibility</Text>
                <Text className="text-muted text-xs mt-0.5">
                  {isPublic
                    ? "Anyone can find and view your profile"
                    : "Only your gang can see your profile"}
                </Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={handleTogglePublic}
                trackColor={{ false: mutedColor + "30", true: successColor }}
                thumbColor="white"
              />
            </View>
          </Surface>
        </SlideIn>

        {/* Gang Section */}
        <SlideIn delay={300}>
          <Pressable onPress={() => router.push("/gang")}>
            {({ pressed }) => (
              <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: "timing", duration: 100 }}>
                <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
                  <View className="flex-row items-center">
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: warningColor + "20" }}
                    >
                      <Users size={20} color={warningColor} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-foreground font-medium text-base">My Gang</Text>
                      <Text className="text-muted text-xs mt-0.5">
                        {stats.gang} mutual connections
                      </Text>
                    </View>
                    <ChevronRight size={20} color={mutedColor} />
                  </View>
                </Surface>
              </MotiView>
            )}
          </Pressable>
        </SlideIn>

        {/* Sign Out */}
        <SlideIn delay={350}>
          <Pressable onPress={handleLogout}>
            {({ pressed }) => (
              <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: "timing", duration: 100 }}>
                <Surface variant="secondary" className="p-4 rounded-2xl mt-4">
                  <View className="flex-row items-center justify-center">
                    <LogOut size={18} color={dangerColor} />
                    <Text className="text-danger font-medium ml-2">Sign Out</Text>
                  </View>
                </Surface>
              </MotiView>
            )}
          </Pressable>
        </SlideIn>

        <View className="h-8" />
      </ScrollView>
    </Container>
  );
}
