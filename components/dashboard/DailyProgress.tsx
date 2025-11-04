import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/common/Card';
import { Progress } from '@/components/common/Progress';
import { darkTheme } from '@/styles/theme';

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
                <View style={styles.goalHeader}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalValue}>
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
    padding: 24, // p-6
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: darkTheme.color.foreground,
    marginBottom: 24,
  },
  goalsList: {
    gap: 24,
  },
  goalItem: {
    gap: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalName: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
  },
  goalValue: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
});

