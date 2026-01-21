import { MotiView } from "moti";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import {
  TrendingUp,
  Camera,
  ImageIcon,
  FileText,
  X,
  Check,
  Trash2,
} from "lucide-react-native";
import { Text, View, Pressable, Image, Alert, TextInput } from "react-native";
import { useState, useMemo } from "react";

import { Container } from "@/components/container";
import { FadeIn, SlideIn, AnimatedProgressBar } from "@/components/animations";
import { useGoals } from "@/hooks/use-data";
import { pickImage, takePhoto } from "@/lib/image-picker";
import { scheduleGoalCompletionNotification } from "@/lib/notifications";

export default function GoalUpdateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { goals, addGoalUpdate, isLoading } = useGoals();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [proofUri, setProofUri] = useState<string | null>(null);

  const foregroundColor = useThemeColor("foreground");
  const successColor = useThemeColor("success");
  const mutedColor = useThemeColor("muted");
  const dangerColor = useThemeColor("danger");

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

  const handlePickImage = async () => {
    const result = await pickImage();
    if (result) {
      setProofUri(result.uri);
    }
  };

  const handleTakePhoto = async () => {
    const result = await takePhoto();
    if (result) {
      setProofUri(result.uri);
    }
  };

  const handleRemoveProof = () => {
    setProofUri(null);
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const numAmount = parseFloat(amount);
    const newTotal = goal.currentValue + numAmount;
    const willComplete = newTotal >= goal.targetValue;
    const willSurpass = newTotal > goal.targetValue;

    await addGoalUpdate({
      goalId: goal.id,
      amount: numAmount,
      note: note.trim() || undefined,
      proofUri: proofUri || undefined,
    });

    // Send notification if goal is completed or surpassed
    if (willComplete && !goal.isCompleted) {
      await scheduleGoalCompletionNotification(goal.title, willSurpass);
    }

    router.back();
  };

  const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
  const newProgress = amount
    ? Math.round(
        ((goal.currentValue + parseFloat(amount || "0")) / goal.targetValue) *
          100
      )
    : progress;

  const isValid = amount && parseFloat(amount) > 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Log Progress",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} className="ml-2">
              <X size={24} color={foregroundColor} />
            </Pressable>
          ),
        }}
      />
      <Container className="p-4">
        {/* Goal Overview */}
        <FadeIn>
          <Surface variant="secondary" className="p-4 rounded-xl mb-6">
            <Text className="text-foreground font-semibold text-lg mb-1">
              {goal.title}
            </Text>
            <View className="flex-row items-baseline mb-3">
              <Text className="text-muted text-sm">
                Current:{" "}
                {goal.unit === "$"
                  ? `$${goal.currentValue.toLocaleString()}`
                  : `${goal.currentValue.toLocaleString()} ${goal.unit}`}
              </Text>
              <Text className="text-muted text-sm mx-2">→</Text>
              <Text className="text-success text-sm font-medium">
                Target:{" "}
                {goal.unit === "$"
                  ? `$${goal.targetValue.toLocaleString()}`
                  : `${goal.targetValue.toLocaleString()} ${goal.unit}`}
              </Text>
            </View>
            <AnimatedProgressBar progress={progress} />
            <Text className="text-muted text-xs mt-2 text-center">
              {progress}% complete
            </Text>
          </Surface>
        </FadeIn>

        {/* Amount Input */}
        <SlideIn delay={100}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-2">
              <TrendingUp size={18} color={foregroundColor} />
              <Text className="text-foreground font-medium ml-2">
                Progress Amount *
              </Text>
            </View>
            <TextInput
              placeholder={`How much ${goal.unit} did you achieve?`}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={{ backgroundColor: 'transparent', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', color: foregroundColor }}
            />
            {amount && parseFloat(amount) > 0 && (
              <MotiView
                from={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3"
              >
                <Text className="text-muted text-sm">
                  New total:{" "}
                  <Text className="text-success font-medium">
                    {goal.unit === "$"
                      ? `$${(
                          goal.currentValue + parseFloat(amount)
                        ).toLocaleString()}`
                      : `${(
                          goal.currentValue + parseFloat(amount)
                        ).toLocaleString()} ${goal.unit}`}
                  </Text>
                  {" "}({newProgress}%)
                </Text>
                {newProgress >= 100 && (
                  <View className="flex-row items-center mt-2">
                    <Check size={14} color={successColor} />
                    <Text className="text-success text-sm ml-1 font-medium">
                      {newProgress > 100
                        ? "Goal will be surpassed! 🎉"
                        : "Goal will be completed! ✅"}
                    </Text>
                  </View>
                )}
              </MotiView>
            )}
          </Surface>
        </SlideIn>

        {/* Note Input */}
        <SlideIn delay={150}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-2">
              <FileText size={18} color={foregroundColor} />
              <Text className="text-foreground font-medium ml-2">
                Note (optional)
              </Text>
            </View>
            <TextInput
              placeholder="Add a note about this progress..."
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={2}
              style={{ backgroundColor: 'transparent', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', color: foregroundColor }}
            />
          </Surface>
        </SlideIn>

        {/* Proof Upload */}
        <SlideIn delay={200}>
          <Surface variant="secondary" className="p-4 rounded-xl mb-6">
            <View className="flex-row items-center mb-3">
              <ImageIcon size={18} color={foregroundColor} />
              <Text className="text-foreground font-medium ml-2">
                Proof (optional)
              </Text>
            </View>
            <Text className="text-muted text-xs mb-3">
              Upload an image as proof of your progress
            </Text>

            {proofUri ? (
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <View className="relative">
                  <Image
                    source={{ uri: proofUri }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={handleRemoveProof}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-danger items-center justify-center"
                  >
                    <Trash2 size={16} color="white" />
                  </Pressable>
                </View>
              </MotiView>
            ) : (
              <View className="flex-row gap-3">
                <Pressable
                  onPress={handlePickImage}
                  className="flex-1 bg-background p-4 rounded-lg items-center"
                >
                  <ImageIcon size={24} color={mutedColor} />
                  <Text className="text-muted text-sm mt-2">Gallery</Text>
                </Pressable>
                <Pressable
                  onPress={handleTakePhoto}
                  className="flex-1 bg-background p-4 rounded-lg items-center"
                >
                  <Camera size={24} color={mutedColor} />
                  <Text className="text-muted text-sm mt-2">Camera</Text>
                </Pressable>
              </View>
            )}
          </Surface>
        </SlideIn>

        {/* Submit Button */}
        <SlideIn delay={250}>
          <Button
            size="lg"
            onPress={handleSubmit}
            isDisabled={!isValid || isLoading}
          >
            <Check size={18} color="white" />
            <Button.Label className="ml-2">
              {isLoading ? "Saving..." : "Log Progress"}
            </Button.Label>
          </Button>
        </SlideIn>
      </Container>
    </>
  );
}
