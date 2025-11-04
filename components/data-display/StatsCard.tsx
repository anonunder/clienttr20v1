import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Card } from '../ui/Card';
import { spacingStyles, layoutStyles, textStyles, componentStyles } from '@/styles/shared-styles';

export interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconColor?: string;
}

export function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <Pressable style={styles.cardWrapper}>
      <Card>
        <View style={styles.cardContent}>
          <View style={styles.container}>
            <View style={layoutStyles.flex1}>
              <Text style={[textStyles.smallMuted, spacingStyles.mb4]}>{label}</Text>
              <Text style={textStyles.valueXLarge}>{value}</Text>
            </View>
            <View style={componentStyles.iconContainer}>
              {icon}
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
  },
  cardContent: {
    ...spacingStyles.p16,
  },
  container: {
    ...layoutStyles.rowBetween,
    alignItems: 'flex-start',
  },
});

