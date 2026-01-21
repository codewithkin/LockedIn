import { MotiView } from "moti";
import { Stack, router } from "expo-router";
import { Surface, Button, useThemeColor } from "heroui-native";
import {
  Users,
  User,
  UserPlus,
  UserMinus,
  X,
  Check,
  Clock,
  Search,
  ArrowLeft,
  MessageCircle,
} from "lucide-react-native";
import { Text, View, Pressable, ScrollView, TextInput, Image, Alert } from "react-native";
import { useState, useMemo } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn } from "@/components/animations";
import { SimpleTabBar } from "@/components/tabs";

type GangMember = {
  id: string;
  name: string;
  email: string;
  image?: string;
  mutualSince: Date;
};

type GangRequest = {
  id: string;
  fromUser: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  createdAt: Date;
};

// Mock data
const MOCK_GANG: GangMember[] = [
  { id: "1", name: "Alex Chen", email: "alex@example.com", mutualSince: new Date("2025-01-15") },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", mutualSince: new Date("2025-01-20") },
  { id: "3", name: "Mike Wilson", email: "mike@example.com", mutualSince: new Date("2025-02-01") },
  { id: "4", name: "Emma Davis", email: "emma@example.com", mutualSince: new Date("2025-02-10") },
];

const MOCK_REQUESTS: GangRequest[] = [
  {
    id: "r1",
    fromUser: { id: "5", name: "John Doe", email: "john@example.com" },
    createdAt: new Date("2025-02-18"),
  },
  {
    id: "r2",
    fromUser: { id: "6", name: "Jane Smith", email: "jane@example.com" },
    createdAt: new Date("2025-02-19"),
  },
];

function GangMemberCard({
  member,
  index = 0,
  onRemove,
}: {
  member: GangMember;
  index?: number;
  onRemove?: () => void;
}) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const warningColor = useThemeColor("warning");
  const dangerColor = useThemeColor("danger");
  const mutedColor = useThemeColor("muted");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <SlideIn delay={index * 50}>
      <Pressable onPress={() => router.push(`/profile/${member.id}`)}>
        {({ pressed }) => (
          <MotiView animate={{ scale: pressed ? 0.98 : 1 }} transition={{ type: "timing", duration: 100 }}>
            <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
              <View className="flex-row items-center">
                {/* Avatar */}
                {member.image ? (
                  <Image source={{ uri: member.image }} className="w-12 h-12 rounded-full mr-4" />
                ) : (
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: warningColor + "20" }}
                  >
                    <User size={22} color={warningColor} />
                  </View>
                )}

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-foreground font-semibold text-base">{member.name}</Text>
                  <Text className="text-muted text-xs">
                    Gang since {formatDate(member.mutualSince)}
                  </Text>
                </View>

                {/* Remove button */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onRemove?.();
                  }}
                  className="p-2"
                >
                  <UserMinus size={18} color={mutedColor} />
                </Pressable>
              </View>
            </Surface>
          </MotiView>
        )}
      </Pressable>
    </SlideIn>
  );
}

function RequestCard({
  request,
  index = 0,
  onAccept,
  onDecline,
}: {
  request: GangRequest;
  index?: number;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const successColor = useThemeColor("success");
  const dangerColor = useThemeColor("danger");
  const mutedColor = useThemeColor("muted");

  return (
    <SlideIn delay={index * 50}>
      <Surface variant="secondary" className="p-4 rounded-2xl mb-3">
        <View className="flex-row items-center">
          {/* Avatar */}
          {request.fromUser.image ? (
            <Image source={{ uri: request.fromUser.image }} className="w-12 h-12 rounded-full mr-4" />
          ) : (
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: accentColor + "20" }}
            >
              <User size={22} color={accentColor} />
            </View>
          )}

          {/* Info */}
          <View className="flex-1">
            <Text className="text-foreground font-semibold text-base">
              {request.fromUser.name}
            </Text>
            <Text className="text-muted text-xs">Wants to join your gang</Text>
          </View>

          {/* Actions */}
          <View className="flex-row gap-2">
            <Pressable
              onPress={onDecline}
              className="w-10 h-10 rounded-full items-center justify-center bg-muted/20"
            >
              <X size={18} color={dangerColor} />
            </Pressable>
            <Pressable
              onPress={onAccept}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: successColor }}
            >
              <Check size={18} color="white" />
            </Pressable>
          </View>
        </View>
      </Surface>
    </SlideIn>
  );
}

export default function GangScreen() {
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const warningColor = useThemeColor("warning");
  const successColor = useThemeColor("success");
  const dangerColor = useThemeColor("danger");
  const mutedColor = useThemeColor("muted");

  const [tabIndex, setTabIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [gang, setGang] = useState<GangMember[]>(MOCK_GANG);
  const [requests, setRequests] = useState<GangRequest[]>(MOCK_REQUESTS);

  const filteredGang = useMemo(() => {
    if (!searchQuery) return gang;
    return gang.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [gang, searchQuery]);

  const handleRemoveMember = (member: GangMember) => {
    Alert.alert(
      "Remove from Gang",
      `Are you sure you want to remove ${member.name} from your gang?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => setGang((prev) => prev.filter((m) => m.id !== member.id)),
        },
      ]
    );
  };

  const handleAcceptRequest = (request: GangRequest) => {
    // Add to gang
    setGang((prev) => [
      ...prev,
      {
        id: request.fromUser.id,
        name: request.fromUser.name,
        email: request.fromUser.email,
        image: request.fromUser.image,
        mutualSince: new Date(),
      },
    ]);
    // Remove request
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
  };

  const handleDeclineRequest = (request: GangRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Gang",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="ml-2">
              <ArrowLeft size={24} color={foregroundColor} />
            </Pressable>
          ),
        }}
      />
      <Container className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="px-4">
          {/* Header Stats */}
          <FadeIn>
            <View className="py-6">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-2xl font-bold text-foreground">My Gang</Text>
                  <Text className="text-muted text-sm mt-0.5">
                    {gang.length} mutual connection{gang.length !== 1 ? "s" : ""}
                  </Text>
                </View>
                <View
                  className="w-14 h-14 rounded-full items-center justify-center"
                  style={{ backgroundColor: warningColor + "20" }}
                >
                  <Users size={26} color={warningColor} />
                </View>
              </View>
            </View>
          </FadeIn>

          {/* Pending Requests Banner */}
          {requests.length > 0 && tabIndex === 0 && (
            <SlideIn delay={50}>
              <Pressable onPress={() => setTabIndex(1)}>
                <Surface
                  variant="secondary"
                  className="p-4 rounded-2xl mb-4 flex-row items-center"
                  style={{ borderWidth: 1, borderColor: accentColor + "40" }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Clock size={18} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-semibold">
                      {requests.length} pending request{requests.length !== 1 ? "s" : ""}
                    </Text>
                    <Text className="text-muted text-xs">Tap to view and respond</Text>
                  </View>
                </Surface>
              </Pressable>
            </SlideIn>
          )}

          {/* Tabs */}
          <SlideIn delay={100}>
            <SimpleTabBar
              tabs={[`Gang (${gang.length})`, `Requests (${requests.length})`]}
              activeIndex={tabIndex}
              onTabChange={setTabIndex}
              style="pill"
            />
          </SlideIn>

          {/* Search (for Gang tab) */}
          {tabIndex === 0 && (
            <SlideIn delay={150}>
              <View className="flex-row items-center bg-muted/20 rounded-xl px-4 py-3 my-4">
                <Search size={18} color={mutedColor} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search gang..."
                  placeholderTextColor={mutedColor}
                  className="flex-1 ml-3 text-foreground"
                  style={{ color: foregroundColor }}
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery("")}>
                    <X size={18} color={mutedColor} />
                  </Pressable>
                )}
              </View>
            </SlideIn>
          )}

          {/* Content */}
          <View className="mt-2">
            {tabIndex === 0 ? (
              // Gang Members
              filteredGang.length > 0 ? (
                filteredGang.map((member, index) => (
                  <GangMemberCard
                    key={member.id}
                    member={member}
                    index={index}
                    onRemove={() => handleRemoveMember(member)}
                  />
                ))
              ) : (
                <Surface variant="secondary" className="p-8 rounded-2xl items-center">
                  <Users size={40} color={mutedColor} />
                  <Text className="text-foreground font-semibold text-lg mt-3">
                    {searchQuery ? "No matches found" : "No gang members yet"}
                  </Text>
                  <Text className="text-muted text-sm text-center mt-1">
                    {searchQuery
                      ? "Try a different search term"
                      : "Send requests to build your gang"}
                  </Text>
                  {!searchQuery && (
                    <Button size="sm" className="mt-4" onPress={() => router.push("/discover")}>
                      <UserPlus size={16} color="white" />
                      <Button.Label className="ml-1">Find People</Button.Label>
                    </Button>
                  )}
                </Surface>
              )
            ) : (
              // Requests
              requests.length > 0 ? (
                requests.map((request, index) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    index={index}
                    onAccept={() => handleAcceptRequest(request)}
                    onDecline={() => handleDeclineRequest(request)}
                  />
                ))
              ) : (
                <Surface variant="secondary" className="p-8 rounded-2xl items-center">
                  <MessageCircle size={40} color={mutedColor} />
                  <Text className="text-foreground font-semibold text-lg mt-3">
                    No pending requests
                  </Text>
                  <Text className="text-muted text-sm text-center mt-1">
                    When someone wants to join your gang, you'll see it here
                  </Text>
                </Surface>
              )
            )}
          </View>

          {/* Info Card */}
          <SlideIn delay={300}>
            <Surface variant="tertiary" className="p-4 rounded-2xl mt-6 mb-8">
              <Text className="text-muted text-xs text-center leading-relaxed">
                Gang connections are mutual – both people need to accept to become gang members.
                Your gang can see your goals and progress when your profile is private.
              </Text>
            </Surface>
          </SlideIn>
        </ScrollView>
      </Container>
    </>
  );
}
