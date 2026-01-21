import { MotiView, MotiText, AnimatePresence } from "moti";
import { type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 400, className }: FadeInProps) {
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration, delay }}
      className={className}
    >
      {children}
    </MotiView>
  );
}

interface SlideInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "left" | "right" | "up" | "down";
  distance?: number;
  className?: string;
}

export function SlideIn({
  children,
  delay = 0,
  duration = 400,
  direction = "up",
  distance = 20,
  className,
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
      className={className}
    >
      {children}
    </MotiView>
  );
}

interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  className?: string;
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 300,
  initialScale = 0.9,
  className,
}: ScaleInProps) {
  return (
    <MotiView
      from={{ opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", damping: 15 }}
      className={className}
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

interface PressableScaleProps {
  children: ReactNode;
  isPressed?: boolean;
  className?: string;
}

export function PressableScale({ children, isPressed, className }: PressableScaleProps) {
  return (
    <MotiView
      animate={{ scale: isPressed ? 0.97 : 1 }}
      transition={{ type: "timing", duration: 100 }}
      className={className}
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

interface PulseProps {
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

export function Pulse({ children, isActive = true, className }: PulseProps) {
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
      className={className}
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
