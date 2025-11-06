import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

export function Loading({ message = 'Loading...', size = 'large', fullScreen = false }: LoadingProps) {
  const containerStyle = fullScreen 
    ? [styles.container, styles.fullScreen]
    : styles.container;

  return (
    <View style={containerStyle}>
      <ActivityIndicator size={size} color={darkTheme.color.primary} />
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  fullScreen: {
    flex: 1,
    minHeight: 200,
  },
  message: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
});

