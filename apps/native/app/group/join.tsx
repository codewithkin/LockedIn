import { MotiView } from "moti";
import { Stack, router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { UserPlus, Hash, X, Search, CheckCircle, XCircle } from "lucide-react-native";
import { Text, View, Pressable, Alert, TextInput } from "react-native";
import { useState } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, ScaleIn } from "@/components/animations";
import { useGroups } from "@/hooks/use-data";

export default function JoinGroupScreen() {
  const { joinGroup, isLoading } = useGroups();

  const [inviteCode, setInviteCode] = useState("");
  const [joinResult, setJoinResult] = useState<"success" | "error" | null>(null);
  const [joinedGroupId, setJoinedGroupId] = useState<string | null>(null);

  const foregroundColor = useThemeColor("foreground");
  const successColor = useThemeColor("success");
  const dangerColor = useThemeColor("danger");
  const accentColor = useThemeColor("accent");

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;

    const group = await joinGroup(inviteCode.trim());

    if (group) {
      setJoinResult("success");
      setJoinedGroupId(group.id);
    } else {
      setJoinResult("error");
    }
  };

  const handleViewGroup = () => {
    if (joinedGroupId) {
      router.replace(`/group/${joinedGroupId}`);
    }
  };

  const handleTryAgain = () => {
    setJoinResult(null);
    setInviteCode("");
  };

  const isValid = inviteCode.trim().length > 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Join Group",
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
              Join a Group
            </Text>
            <Text className="text-muted text-sm">
              Enter an invite code to join an existing group
            </Text>
          </View>
        </FadeIn>

        {joinResult === null && (
          <>
            {/* Invite Code Input */}
            <SlideIn delay={100}>
              <Surface variant="secondary" className="p-4 rounded-xl mb-6">
                <View className="flex-row items-center mb-2">
                  <Hash size={18} color={foregroundColor} />
                  <Text className="text-foreground font-medium ml-2">
                    Invite Code
                  </Text>
                </View>
                <TextInput
                  placeholder="Enter invite code (e.g., FIT2026)"
                  value={inviteCode}
                  onChangeText={(text: string) => setInviteCode(text.toUpperCase())}
                  autoCapitalize="characters"
                  style={{ backgroundColor: 'transparent', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', color: foregroundColor, fontFamily: 'monospace', textAlign: 'center', fontSize: 18, letterSpacing: 4 }}
                />
                <Text className="text-muted text-xs mt-2 text-center">
                  Ask the group owner for the invite code
                </Text>
              </Surface>
            </SlideIn>

            {/* Join Button */}
            <SlideIn delay={150}>
              <Button
                size="lg"
                onPress={handleJoin}
                isDisabled={!isValid || isLoading}
              >
                <Search size={18} color="white" />
                <Button.Label className="ml-2">
                  {isLoading ? "Searching..." : "Find & Join Group"}
                </Button.Label>
              </Button>
            </SlideIn>

            {/* Example Codes */}
            <SlideIn delay={200}>
              <Surface variant="tertiary" className="p-4 rounded-xl mt-6">
                <Text className="text-muted text-xs text-center mb-2">
                  Try these example codes:
                </Text>
                <View className="flex-row justify-center gap-3">
                  {["FIT2026", "MONEY26"].map((code) => (
                    <Pressable
                      key={code}
                      onPress={() => setInviteCode(code)}
                      className="px-3 py-2 rounded-lg bg-accent/20"
                    >
                      <Text className="text-accent font-mono font-medium">
                        {code}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Surface>
            </SlideIn>
          </>
        )}

        {/* Success State */}
        {joinResult === "success" && (
          <ScaleIn>
            <Surface
              variant="secondary"
              className="p-8 rounded-xl items-center"
            >
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <View className="w-20 h-20 rounded-full bg-success/20 items-center justify-center mb-4">
                  <CheckCircle size={48} color={successColor} />
                </View>
              </MotiView>
              <Text className="text-foreground font-bold text-xl mb-2">
                You're in! 🎉
              </Text>
              <Text className="text-muted text-sm text-center mb-6">
                You've successfully joined the group
              </Text>
              <Button size="lg" onPress={handleViewGroup} className="w-full">
                <UserPlus size={18} color="white" />
                <Button.Label className="ml-2">View Group</Button.Label>
              </Button>
            </Surface>
          </ScaleIn>
        )}

        {/* Error State */}
        {joinResult === "error" && (
          <ScaleIn>
            <Surface
              variant="secondary"
              className="p-8 rounded-xl items-center"
            >
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <View className="w-20 h-20 rounded-full bg-danger/20 items-center justify-center mb-4">
                  <XCircle size={48} color={dangerColor} />
                </View>
              </MotiView>
              <Text className="text-foreground font-bold text-xl mb-2">
                Group Not Found
              </Text>
              <Text className="text-muted text-sm text-center mb-6">
                We couldn't find a group with that invite code. Please check and
                try again.
              </Text>
              <Button
                size="lg"
                variant="secondary"
                onPress={handleTryAgain}
                className="w-full"
              >
                <Button.Label>Try Again</Button.Label>
              </Button>
            </Surface>
          </ScaleIn>
        )}
      </Container>
    </>
  );
}
