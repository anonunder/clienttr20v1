import { Stack } from 'expo-router';
import { MainLayout } from '@/components/common/MainLayout';
import { usePathname } from 'expo-router';
import { useMemo } from 'react';

// Map routes to titles
const routeTitles: Record<string, string> = {
  '/(protected)/(tabs)/home': 'Dashboard',
  '/(protected)/(tabs)/programs': 'Programs',
  '/(protected)/(tabs)/progress': 'Progress',
  '/(protected)/(tabs)/chat': 'Chat',
  '/(protected)/(tabs)/profile': 'Profile',
  '/(protected)/(tabs)/favorites': 'Favorites',
  '/(protected)/(tabs)/reports': 'Reports',
};

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="questionnaires" options={{ headerShown: false }} />
    </Stack>
  );
}

