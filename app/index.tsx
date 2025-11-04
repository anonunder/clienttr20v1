import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useAuthInit } from '../hooks/use-auth-init';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { isInitialized } = useAuthInit();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isInitialized) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#3EE9A8" />
      </View>
    );
  }

  // Redirect based on auth status
  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)/home" />;
  }

  // Show loading screen first, then redirect to login
  return <Redirect href="/(auth)/loading" />;
}

