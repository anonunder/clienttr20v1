import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainLayout } from '@/components/layout/MainLayout';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

/**
 * 👤 Profile Screen
 * 
 * Empty screen placeholder for user profile.
 */
export default function ProfileScreen() {
  return (
    <MainLayout 
      title="Profile" 
      description="Manage your account and preferences"
    >
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Profile screen coming soon</Text>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
  },
});
