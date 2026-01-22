import * as React from 'react';
import { View, Pressable, Modal, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { cn } from '@/lib/cn';

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu compound components must be used within a DropdownMenu component');
  }
  return context;
}

interface DropdownMenuProps {
  children: React.ReactNode;
}

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <View className="relative">{children}</View>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

function DropdownMenuTrigger({ children, className, asChild }: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownMenuContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => setOpen(!open),
    });
  }

  return (
    <Pressable onPress={() => setOpen(!open)} className={cn('', className)}>
      {children}
    </Pressable>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom';
}

function DropdownMenuContent({
  children,
  className,
  align = 'end',
  side = 'bottom',
}: DropdownMenuContentProps) {
  const { open, setOpen } = useDropdownMenuContext();

  if (!open) return null;

  return (
    <Modal
      transparent
      visible={open}
      animationType="none"
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        className="flex-1"
        onPress={() => setOpen(false)}
      >
        <View
          className="flex-1 justify-start items-end p-4 pt-16"
          pointerEvents="box-none"
        >
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(100)}
            className={cn(
              'min-w-[180px] light:bg-white dark:bg-slate-800 rounded-lg light:border-blue-700 dark:border-slate-700 light:border dark:border shadow-lg overflow-hidden',
              className
            )}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              {children}
            </Pressable>
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  );
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

function DropdownMenuItem({
  children,
  className,
  onPress,
  disabled,
  destructive,
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenuContext();

  const handlePress = () => {
    onPress?.();
    setOpen(false);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={cn(
        'flex-row items-center gap-3 px-4 py-3 light:active:bg-gray-100 dark:active:bg-gray-700',
        disabled && 'opacity-50',
        className
      )}
    >
      {typeof children === 'string' ? (
        <Text
          className={cn(
            'text-sm text-foreground',
            destructive && 'light:text-red-500 dark:text-red-400'
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

function DropdownMenuLabel({ children, className }: DropdownMenuLabelProps) {
  return (
    <View className={cn('px-4 py-2', className)}>
      {typeof children === 'string' ? (
        <Text className="text-sm font-semibold text-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <View className={cn('h-px light:bg-gray-200 dark:bg-gray-700 my-1', className)} />;
}

interface DropdownMenuGroupProps {
  children: React.ReactNode;
  className?: string;
}

function DropdownMenuGroup({ children, className }: DropdownMenuGroupProps) {
  return <View className={cn('', className)}>{children}</View>;
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
