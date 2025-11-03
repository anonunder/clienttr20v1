import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { logout as logoutAction } from '@/state/slices/auth-slice';
import { logout as logoutService } from '@/services/auth/auth-service';
import type { RootState } from '@/state/store';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      await logoutService();
      dispatch(logoutAction());
      router.replace('/(auth)/login');
    } catch (error) {
      // Even if service fails, clear Redux state
      dispatch(logoutAction());
      router.replace('/(auth)/login');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4 py-3">
        <Text className="text-text text-2xl font-bold mb-4">{t('profile.title')}</Text>

        {isAuthenticated && user ? (
          <View className="bg-card rounded-xl p-4 border border-border mb-4">
            <Text className="text-text text-lg font-semibold">{user.name}</Text>
            <Text className="text-textMuted text-sm">{user.email}</Text>
          </View>
        ) : (
          <View className="bg-card rounded-xl p-4 border border-border mb-4">
            <Text className="text-textMuted">Not logged in</Text>
          </View>
        )}

        <View className="gap-3">
          <View className="bg-card rounded-xl border border-border overflow-hidden">
            <TouchableOpacity className="p-4 border-b border-border">
              <Text className="text-text font-semibold">{t('profile.personal')}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 border-b border-border">
              <Text className="text-text font-semibold">{t('profile.preferences')}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4">
              <Text className="text-text font-semibold">{t('profile.settings')}</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-card rounded-xl border border-border overflow-hidden">
            <TouchableOpacity className="p-4 border-b border-border">
              <Text className="text-text">{t('profile.theme')}</Text>
              <Text className="text-textMuted text-sm mt-1">Auto</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4 border-b border-border">
              <Text className="text-text">{t('profile.language')}</Text>
              <Text className="text-textMuted text-sm mt-1">English</Text>
            </TouchableOpacity>
            <TouchableOpacity className="p-4">
              <Text className="text-text">{t('profile.notifications')}</Text>
              <Text className="text-textMuted text-sm mt-1">Enabled</Text>
            </TouchableOpacity>
          </View>

          {isAuthenticated && (
            <TouchableOpacity
              className="bg-danger rounded-xl p-4 items-center"
              onPress={handleLogout}
            >
              <Text className="text-white font-semibold">{t('auth.logout')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

