import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { componentStyles, textStyles, spacingStyles } from '@/styles/shared-styles';

interface ListItemProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
}

/**
 * Reusable list item component
 * Consolidates repeated pattern across multiple components
 */
export function ListItem({ title, subtitle, rightContent, onPress, disabled, style }: ListItemProps) {
  const Container = onPress ? Pressable : View;
  
  return (
    <Container
      style={[componentStyles.listItem, disabled && { opacity: 0.6 }, style]}
      onPress={onPress}
      disabled={disabled || !onPress}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={[textStyles.smallMedium, disabled && { opacity: 0.6 }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[textStyles.smallMuted, disabled && { opacity: 0.6 }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightContent}
    </Container>
  );
}

