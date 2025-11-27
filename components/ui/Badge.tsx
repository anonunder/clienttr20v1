import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { darkTheme } from '@/styles/theme';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({ 
  children, 
  variant = 'default',
  style,
  textStyle 
}: BadgeProps) {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      paddingVertical: 2,
      borderRadius: 9999, // fully rounded
      gap: 4,
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: darkTheme.color.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: darkTheme.color.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: darkTheme.color.border,
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: `${darkTheme.color.success}33`, // 20% opacity
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: `${darkTheme.color.warning}33`, // 20% opacity
        };
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: `${darkTheme.color.destructive}33`, // 20% opacity
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 16,
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          color: darkTheme.color.primaryForeground,
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: darkTheme.color.secondaryForeground,
        };
      case 'outline':
        return {
          ...baseStyle,
          color: darkTheme.color.foreground,
        };
      case 'success':
        return {
          ...baseStyle,
          color: darkTheme.color.success,
        };
      case 'warning':
        return {
          ...baseStyle,
          color: darkTheme.color.warning,
        };
      case 'destructive':
        return {
          ...baseStyle,
          color: darkTheme.color.destructive,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      {typeof children === 'string' ? (
        <Text style={[getTextStyle(), textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
