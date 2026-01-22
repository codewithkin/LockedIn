import * as React from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LayoutAnimationConfig,
  LinearTransition,
} from 'react-native-reanimated';
import { TextClassContext } from './text';
import { cn } from '@/lib/cn';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View className={cn('w-full', className)}>{children}</View>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <View
      className={cn(
        'h-10 flex-row items-center justify-center rounded-md bg-muted p-1',
        className
      )}
    >
      {children}
    </View>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

function TabsTrigger({ value, children, className, disabled }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm font-medium native:text-base',
        isSelected ? 'text-foreground' : 'text-muted-foreground'
      )}
    >
      <Pressable
        disabled={disabled}
        onPress={() => onValueChange(value)}
        className={cn(
          'flex-1 flex-row items-center justify-center gap-1.5 rounded-sm px-3 py-1.5',
          isSelected && 'bg-background shadow-sm',
          disabled && 'opacity-50',
          className
        )}
      >
        {children}
      </Pressable>
    </TextClassContext.Provider>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: selectedValue } = useTabsContext();

  if (selectedValue !== value) {
    return null;
  }

  return (
    <LayoutAnimationConfig skipEntering>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        layout={LinearTransition.duration(200)}
        className={cn('mt-2', className)}
      >
        {children}
      </Animated.View>
    </LayoutAnimationConfig>
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
