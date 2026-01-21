import React, { useCallback, useMemo, forwardRef, useImperativeHandle, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { useThemeColor } from "heroui-native";
import { X } from "lucide-react-native";

export interface AppBottomSheetRef {
  open: () => void;
  close: () => void;
  expand: () => void;
  collapse: () => void;
}

interface AppBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  title?: string;
  showHandle?: boolean;
  showCloseButton?: boolean;
  enablePanDownToClose?: boolean;
  scrollable?: boolean;
  onClose?: () => void;
}

export const AppBottomSheet = forwardRef<AppBottomSheetRef, AppBottomSheetProps>(
  (
    {
      children,
      snapPoints: customSnapPoints,
      title,
      showHandle = true,
      showCloseButton = true,
      enablePanDownToClose = true,
      scrollable = false,
      onClose,
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const backgroundColor = useThemeColor("background");
    const foregroundColor = useThemeColor("foreground");
    const mutedColor = useThemeColor("muted");

    // Default snap points
    const snapPoints = useMemo(
      () => customSnapPoints || ["25%", "50%", "75%"],
      [customSnapPoints]
    );

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.expand();
      },
      close: () => {
        bottomSheetRef.current?.close();
        onClose?.();
      },
      expand: () => {
        bottomSheetRef.current?.expand();
      },
      collapse: () => {
        bottomSheetRef.current?.collapse();
      },
    }));

    // Render backdrop
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    // Handle sheet changes
    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose?.();
        }
      },
      [onClose]
    );

    const handleClose = useCallback(() => {
      bottomSheetRef.current?.close();
      onClose?.();
    }, [onClose]);

    const ContentWrapper = scrollable ? BottomSheetScrollView : BottomSheetView;

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        handleIndicatorStyle={{
          backgroundColor: mutedColor,
          width: 40,
          height: 4,
          display: showHandle ? "flex" : "none",
        }}
        backgroundStyle={{
          backgroundColor,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        style={styles.sheet}
      >
        <ContentWrapper style={styles.contentContainer}>
          {/* Header with title and close button */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title ? (
                <Text
                  style={[styles.title, { color: foregroundColor }]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
              ) : (
                <View />
              )}
              {showCloseButton && (
                <Pressable
                  onPress={handleClose}
                  style={[styles.closeButton, { backgroundColor: mutedColor + "20" }]}
                  hitSlop={8}
                >
                  <X size={20} color={foregroundColor} />
                </Pressable>
              )}
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </ContentWrapper>
      </BottomSheet>
    );
  }
);

AppBottomSheet.displayName = "AppBottomSheet";

// Simple modal bottom sheet that takes full content height
interface ModalBottomSheetProps {
  children: React.ReactNode;
  title?: string;
  visible: boolean;
  onClose: () => void;
}

export function ModalBottomSheet({
  children,
  title,
  visible,
  onClose,
}: ModalBottomSheetProps) {
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");

  const snapPoints = useMemo(() => ["50%", "75%", "90%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  if (!visible) return null;

  return (
    <BottomSheet
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onChange={(index) => {
        if (index === -1) onClose();
      }}
      handleIndicatorStyle={{
        backgroundColor: mutedColor,
        width: 40,
        height: 4,
      }}
      backgroundStyle={{
        backgroundColor,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
    >
      <BottomSheetScrollView style={styles.contentContainer}>
        {title && (
          <View style={styles.header}>
            <Text style={[styles.title, { color: foregroundColor }]}>{title}</Text>
            <Pressable
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: mutedColor + "20" }]}
              hitSlop={8}
            >
              <X size={20} color={foregroundColor} />
            </Pressable>
          </View>
        )}
        <View style={styles.content}>{children}</View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default AppBottomSheet;
