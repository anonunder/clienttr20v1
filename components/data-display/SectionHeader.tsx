import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { darkTheme } from '@/styles/theme';
import { componentStyles, textStyles } from '@/styles/shared-styles';

interface SectionHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  actionTitle?: string;
  onActionPress?: () => void;
}

/**
 * Reusable section header component
 * Consolidates repeated pattern from home/index.tsx, TodayMeals, TodayExercises
 */
export function SectionHeader({ icon, title, actionTitle, onActionPress }: SectionHeaderProps) {
  return (
    <View style={componentStyles.sectionHeader}>
      <View style={componentStyles.sectionHeaderLeft}>
        <Ionicons name={icon} size={20} color={darkTheme.color.primary} />
        <Text style={textStyles.h4}>{title}</Text>
      </View>
      {actionTitle && onActionPress && (
        <Button
          variant="ghost"
          size="sm"
          title={actionTitle}
          onPress={onActionPress}
        />
      )}
    </View>
  );
}

