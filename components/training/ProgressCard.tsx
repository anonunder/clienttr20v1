import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';
import { textStyles, spacingStyles, layoutStyles } from '@/styles/shared-styles';

interface ProgressCardProps {
  completedCount: number;
  totalCount: number;
  totalExercises: number;
}

export function ProgressCard({ completedCount, totalCount, totalExercises }: ProgressCardProps) {
  return (
    <Card>
      <View style={spacingStyles.p24}>
        <Text style={styles.title}>Today's Progress</Text>
        <View style={styles.grid}>
          {/* Workouts Done */}
          <View style={styles.statItem}>
            <View style={layoutStyles.rowCenterGap8}>
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={20} color={darkTheme.color.primary} />
              </View>
              <View>
                <Text style={styles.statValue}>
                  {completedCount}/{totalCount}
                </Text>
                <Text style={styles.statLabel}>Workouts Done</Text>
              </View>
            </View>
          </View>

          {/* Total Exercises */}
          <View style={styles.statItem}>
            <View style={layoutStyles.rowCenterGap8}>
              <View style={styles.iconContainer}>
                <Ionicons name="barbell-outline" size={20} color={darkTheme.color.primary} />
              </View>
              <View>
                <Text style={styles.statValue}>{totalExercises}</Text>
                <Text style={styles.statLabel}>Total Exercises</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...textStyles.h3,
    fontWeight: '700',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    gap: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${darkTheme.color.primary}33`, // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    ...textStyles.valueXLarge,
    fontWeight: '700',
  },
  statLabel: {
    ...textStyles.caption,
    fontSize: 12,
    color: darkTheme.color.mutedForeground,
  },
});

