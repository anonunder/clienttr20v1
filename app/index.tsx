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
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect based on auth status
  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}

