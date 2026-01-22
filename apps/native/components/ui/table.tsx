import * as React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { cn } from '@/lib/cn';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

function Table({ children, className }: TableProps) {
  return (
    <View className={cn('w-full rounded-md border border-border', className)}>
      {children}
    </View>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <View className={cn('bg-muted/50 rounded-t-md', className)}>
      {children}
    </View>
  );
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

function TableBody({ children, className }: TableBodyProps) {
  return <View className={cn('', className)}>{children}</View>;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  isLast?: boolean;
}

function TableRow({ children, className, isLast }: TableRowProps) {
  return (
    <View
      className={cn(
        'flex-row items-center px-4 py-3',
        !isLast && 'border-b border-border',
        className
      )}
    >
      {children}
    </View>
  );
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  flex?: number;
}

function TableHead({ children, className, flex = 1 }: TableHeadProps) {
  return (
    <View className={cn('', className)} style={{ flex }}>
      <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {children}
      </Text>
    </View>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  flex?: number;
}

function TableCell({ children, className, flex = 1 }: TableCellProps) {
  return (
    <View className={cn('', className)} style={{ flex }}>
      {typeof children === 'string' ? (
        <Text className="text-sm text-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

interface TableCaptionProps {
  children: React.ReactNode;
  className?: string;
}

function TableCaption({ children, className }: TableCaptionProps) {
  return (
    <View className={cn('py-2 px-4', className)}>
      <Text className="text-xs text-muted-foreground text-center">{children}</Text>
    </View>
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
};
