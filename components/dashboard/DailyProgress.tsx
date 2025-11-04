import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { spacingStyles, layoutStyles, textStyles } from '@/styles/shared-styles';

export interface Goal {
  name: string;
  current: number;
  target: number;
  unit: string;
}

interface DailyProgressProps {
  goals: Goal[];
}

export function DailyProgress({ goals }: DailyProgressProps) {
  return (
    <Card>
      <View style={styles.cardContent}>
        <Text style={styles.title}>Daily Progress</Text>
        <View style={styles.goalsList}>
          {goals.map((goal) => {
            const percentage = (goal.current / goal.target) * 100;
            return (
              <View key={goal.name} style={styles.goalItem}>
                <View style={layoutStyles.rowBetween}>
                  <Text style={textStyles.smallMedium}>{goal.name}</Text>
                  <Text style={textStyles.smallMuted}>
                    {goal.current} / {goal.target} {goal.unit}
                  </Text>
                </View>
                <Progress value={percentage} />
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    ...spacingStyles.p24,
  },
  title: {
    ...textStyles.h3,
    fontWeight: '600',
    ...spacingStyles.mb24,
  },
  goalsList: {
    gap: 24,
  },
  goalItem: {
    gap: 8,
  },
});

