import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Settings, LogOut, Bell, ChevronRight, Moon, Sun } from 'lucide-react-native';
import { useThemeColor } from 'heroui-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/hooks/use-data';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface UserMenuProps {
  showName?: boolean;
}

export function UserMenu({ showName = false }: UserMenuProps) {
  const { user } = useUser();
  const router = useRouter();
  const foregroundColor = useThemeColor('foreground');
  const mutedColor = useThemeColor('muted');
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  const toggleTheme = () => {
    setColorScheme(isDarkColorScheme ? 'light' : 'dark');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Pressable className="flex-row items-center gap-2">
          <Avatar alt={user?.name || 'User'} className="w-8 h-8">
            <AvatarImage source={{ uri: user?.avatarUrl }} />
            <AvatarFallback>
              <Text className="text-xs font-semibold">{initials}</Text>
            </AvatarFallback>
          </Avatar>
          {showName && user?.name && (
            <Text className="text-sm font-medium text-foreground">{user.name}</Text>
          )}
        </Pressable>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <View className="flex-row items-center gap-3">
            <Avatar alt={user?.name || 'User'} className="w-10 h-10">
              <AvatarImage source={{ uri: user?.avatarUrl }} />
              <AvatarFallback>
                <Text className="text-sm font-semibold">{initials}</Text>
              </AvatarFallback>
            </Avatar>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                {user?.name || 'User'}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onPress={() => router.push('/(drawer)/(tabs)/profile')}>
            <User size={18} color={foregroundColor} />
            <Text className="flex-1 text-sm text-foreground">Profile</Text>
            <ChevronRight size={16} color={mutedColor} />
          </DropdownMenuItem>

          <DropdownMenuItem onPress={() => router.push('/(drawer)/notifications')}>
            <Bell size={18} color={foregroundColor} />
            <Text className="flex-1 text-sm text-foreground">Notifications</Text>
            <ChevronRight size={16} color={mutedColor} />
          </DropdownMenuItem>

          <DropdownMenuItem onPress={toggleTheme}>
            {isDarkColorScheme ? (
              <Sun size={18} color={foregroundColor} />
            ) : (
              <Moon size={18} color={foregroundColor} />
            )}
            <Text className="flex-1 text-sm text-foreground">
              {isDarkColorScheme ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onPress={() => console.log('Logout')} destructive>
          <LogOut size={18} color="#ef4444" />
          <Text className="text-sm text-destructive">Logout</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
