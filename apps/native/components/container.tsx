import { cn } from "heroui-native";
import { type PropsWithChildren, type ReactElement } from "react";
import { ScrollView, View, type ViewProps, type RefreshControlProps } from "react-native";
import Animated, { type AnimatedProps } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedView = Animated.createAnimatedComponent(View);

type Props = AnimatedProps<ViewProps> & {
  className?: string;
  refreshControl?: ReactElement<RefreshControlProps>;
};

export function Container({ children, className, refreshControl, ...props }: PropsWithChildren<Props>) {
  const insets = useSafeAreaInsets();

  return (
    <AnimatedView
      className={cn("flex-1 bg-background", className)}
      style={{
        paddingBottom: insets.bottom,
      }}
      {...props}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </AnimatedView>
  );
}
