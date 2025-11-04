import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/data-display/SectionHeader';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, componentStyles, textStyles, borderStyles, layoutStyles } from '@/styles/shared-styles';

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
}

interface TodayExercisesProps {
  exercises: Exercise[];
}

export function TodayExercises({ exercises }: TodayExercisesProps) {
  return (
    <Card>
      <View style={styles.cardContent}>
        <SectionHeader
          icon="barbell"
          title="Today's Exercises"
          actionTitle="View All"
          onActionPress={() => console.log('View all exercises - route not implemented')}
        />
        <View style={styles.exercisesList}>
          {exercises.map((exercise) => (
            <View
              key={exercise.id}
              style={componentStyles.listItem}
            >
              <View style={layoutStyles.flex1}>
                <Text
                  style={[
                    textStyles.smallMedium,
                    exercise.completed && styles.exerciseNameCompleted,
                  ]}
                >
                  {exercise.name}
                </Text>
                <Text style={textStyles.smallMuted}>
                  {exercise.sets} sets × {exercise.reps} reps
                </Text>
              </View>
              {exercise.completed && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={darkTheme.color.success} />
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    ...spacingStyles.p24,
  },
  exercisesList: {
    gap: 12,
  },
  exerciseNameCompleted: {
    color: darkTheme.color.mutedForeground,
    textDecorationLine: 'line-through',
  },
  completedBadge: {
    width: 24,
    height: 24,
    ...borderStyles.rounded12,
    backgroundColor: `${darkTheme.color.success}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

