import { MotiView, MotiText, AnimatePresence } from "moti";
import type { MotiViewProps } from "moti";
import { type ReactNode } from "react";

interface FadeInProps extends MotiViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, delay = 0, duration = 400, ...props }: FadeInProps) {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration, delay }}
      {...props}
    >
      {children}
    </MotiView>
  );
}

interface SlideInProps extends MotiViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
}

export function SlideIn({
  children,
  delay = 0,
  duration = 400,
  direction = "up",
  distance = 20,
  ...props
}: SlideInProps) {
  const getTranslation = () => {
    switch (direction) {
      case "left":
        return { translateX: -distance };
      case "right":
        return { translateX: distance };
      case "up":
        return { translateY: distance };
      case "down":
        return { translateY: -distance };
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, ...getTranslation() }}
      animate={{ opacity: 1, translateX: 0, translateY: 0 }}
      transition={{ type: "timing", duration, delay }}
      {...props}
    >
      {children}
    </MotiView>
  );
}

interface ScaleInProps extends MotiViewProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 300,
  initialScale = 0.9,
  ...props
}: ScaleInProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15, delay }}
      {...props}
    >
      {children}
    </MotiView>
  );
}

interface StaggerProps {
  children: ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
}

export function Stagger({ children, staggerDelay = 100, initialDelay = 0 }: StaggerProps) {
  return (
    <>
      {children.map((child, index) => (
        <SlideIn key={index} delay={initialDelay + index * staggerDelay}>
          {child}
        </SlideIn>
      ))}
    </>
  );
}

interface PressableScaleProps extends MotiViewProps {
  children: ReactNode;
  isPressed?: boolean;
}

export function PressableScale({ children, isPressed, ...props }: PressableScaleProps) {
  return (
    <MotiView
      animate={{ scale: isPressed ? 0.97 : 1 }}
      transition={{ type: "timing", duration: 100 }}
      {...props}
    >
      {children}
    </MotiView>
  );
}

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  isSurpassed?: boolean;
}

export function AnimatedProgressBar({
  progress,
  height = 8,
  isSurpassed = false,
}: ProgressBarProps) {
  const clampedProgress = Math.min(progress, 100);

  return (
    <MotiView
      className="w-full bg-muted/30 rounded-full overflow-hidden"
      style={{ height }}
    >
      <MotiView
        className={`h-full rounded-full ${isSurpassed ? "bg-amber-500" : "bg-success"}`}
        from={{ width: "0%" }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{ type: "timing", duration: 800 }}
      />
    </MotiView>
  );
}

interface PulseProps extends MotiViewProps {
  children: ReactNode;
  isActive?: boolean;
}

export function Pulse({ children, isActive = true, ...props }: PulseProps) {
  return (
    <MotiView
      animate={{
        scale: isActive ? [1, 1.05, 1] : 1,
      }}
      transition={{
        type: "timing",
        duration: 1000,
        loop: isActive,
      }}
      {...props}
    >
      {children}
    </MotiView>
  );
}

export function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <MotiText
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15 }}
    >
      {prefix}{value.toLocaleString()}{suffix}
    </MotiText>
  );
}

export { AnimatePresence };
