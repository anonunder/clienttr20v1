import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';

export interface AvatarProps {
  source?: string | null;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  style?: ViewStyle;
  showOnlineStatus?: boolean;
  isOnline?: boolean;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 96,
};

const fontSizeMap = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 36,
};

const onlineIndicatorSizeMap = {
  xs: 6,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  '2xl': 20,
};

export function Avatar({ 
  source, 
  fallback, 
  size = 'md', 
  style,
  showOnlineStatus = false,
  isOnline = false,
}: AvatarProps) {
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const onlineSize = onlineIndicatorSizeMap[size];

  const containerStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    ...style,
  };

  const fallbackTextStyle: TextStyle = {
    fontSize,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  };

  const onlineIndicatorStyle: ViewStyle = {
    width: onlineSize,
    height: onlineSize,
    borderRadius: onlineSize / 2,
    borderWidth: 2,
    borderColor: darkTheme.color.card,
    backgroundColor: darkTheme.color.success,
    position: 'absolute',
    bottom: 0,
    right: 0,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.fallbackContainer, containerStyle]}>
          {fallback ? (
            <Text style={fallbackTextStyle}>{fallback.charAt(0).toUpperCase()}</Text>
          ) : (
            <Ionicons name="person" size={fontSize} color={darkTheme.color.mutedForeground} />
          )}
        </View>
      )}
      {showOnlineStatus && isOnline && (
        <View style={onlineIndicatorStyle} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: darkTheme.color.secondary,
  },
  fallbackContainer: {
    backgroundColor: darkTheme.color.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

