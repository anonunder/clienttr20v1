import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AppProviders } from '../providers/app-providers';
import { ErrorBoundary } from '../utils/error-boundary';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useAuthInit } from '../hooks/use-auth-init';
import { View, ActivityIndicator } from 'react-native';
import '../i18n';
import '../global.css';

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { isInitialized } = useAuthInit();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inProtectedGroup = segments[0] === '(protected)';

    // If not authenticated and trying to access protected routes → go to login
    if (!isAuthenticated && inProtectedGroup) {
      router.replace('/(auth)/login');
    }

    // If authenticated and on login page → go to home
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(protected)/(tabs)/home');
    }
  }, [isAuthenticated, isInitialized, segments, router]);

  // Show loading while checking auth
  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
    </ErrorBoundary>
  );
}

