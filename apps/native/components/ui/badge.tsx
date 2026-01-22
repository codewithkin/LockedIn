import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, View, ViewProps } from 'react-native';

const badgeVariants = cva(
  cn(
    'border-border group shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5',
    Platform.select({
      web: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-fit whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3',
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'light:bg-blue-600 dark:bg-blue-700 border-transparent',
          Platform.select({ web: '[a&]:hover:light:bg-blue-700 [a&]:hover:dark:bg-blue-600' })
        ),
        secondary: cn(
          'light:bg-gray-200 dark:bg-gray-700 border-transparent',
          Platform.select({ web: '[a&]:hover:light:bg-gray-300 [a&]:hover:dark:bg-gray-600' })
        ),
        destructive: cn(
          'light:bg-red-500 dark:bg-red-600 border-transparent',
          Platform.select({ web: '[a&]:hover:light:bg-red-600 [a&]:hover:dark:bg-red-700' })
        ),
        outline: Platform.select({ web: 'light:border-gray-300 dark:border-gray-600 [a&]:hover:light:bg-gray-100 [a&]:hover:dark:bg-gray-800 [a&]:hover:text-accent-foreground' }),
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('text-xs font-medium', {
  variants: {
    variant: {
      default: 'light:text-white dark:text-white',
      secondary: 'light:text-gray-900 dark:text-gray-100',
      destructive: 'light:text-white dark:text-white',
      outline: 'light:text-gray-900 dark:text-gray-100',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = ViewProps &
  React.RefAttributes<View> & {
    asChild?: boolean;
  } & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot.View : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
