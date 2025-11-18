import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: darkTheme.color.primary,
          borderColor: 'transparent',
          color: darkTheme.color.primaryForeground,
        };
      case 'secondary':
        return {
          backgroundColor: darkTheme.color.secondary,
          borderColor: 'transparent',
          color: darkTheme.color.secondaryForeground,
        };
      case 'destructive':
        return {
          backgroundColor: darkTheme.color.destructive,
          borderColor: 'transparent',
          color: darkTheme.color.destructiveForeground,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: darkTheme.color.border,
          color: darkTheme.color.foreground,
        };
      default:
        return {
          backgroundColor: darkTheme.color.primary,
          borderColor: 'transparent',
          color: darkTheme.color.primaryForeground,
        };
    }
  };

  const variantStyle = getVariantStyle();

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: variantStyle.backgroundColor,
        borderColor: variantStyle.borderColor,
      },
    ]}>
      <Text style={[styles.text, { color: variantStyle.color }]}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 9999, // rounded-full
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

