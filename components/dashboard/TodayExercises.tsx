import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { darkTheme } from '@/styles/theme';
import { router } from 'expo-router';

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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="barbell" size={20} color={darkTheme.color.primary} />
            <Text style={styles.title}>Today's Exercises</Text>
          </View>
          <Button
            variant="ghost"
            size="sm"
            title="View All"
            onPress={() => router.push('/programs/training')}
          />
        </View>
        <View style={styles.exercisesList}>
          {exercises.map((exercise) => (
            <View
              key={exercise.id}
              style={styles.exerciseItem}
            >
              <View style={styles.exerciseContent}>
                <Text
                  style={[
                    styles.exerciseName,
                    exercise.completed && styles.exerciseNameCompleted,
                  ]}
                >
                  {exercise.name}
                </Text>
                <Text style={styles.exerciseDetails}>
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
    padding: 24, // p-6
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  exercisesList: {
    gap: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: `${darkTheme.color.secondary}4D`, // 30% opacity
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
    marginBottom: 4,
  },
  exerciseNameCompleted: {
    color: darkTheme.color.mutedForeground,
    textDecorationLine: 'line-through',
  },
  exerciseDetails: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${darkTheme.color.success}33`, // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
});

