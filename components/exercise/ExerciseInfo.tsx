import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

interface ExerciseInfoProps {
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sets?: number;
  reps?: number;
  muscles?: string[];
  instructions?: string[];
}

export function ExerciseInfo({
  name,
  description,
  difficulty,
  sets,
  reps,
  muscles,
  instructions,
}: ExerciseInfoProps) {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Hard':
        return darkTheme.color.destructive;
      case 'Medium':
        return darkTheme.color.warning;
      case 'Easy':
      default:
        return darkTheme.color.success;
    }
  };

  return (
    <View style={styles.container}>
      {/* Exercise Name and Details */}
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: `${getDifficultyColor()}20` }]}>
            <Text style={[styles.badgeText, { color: getDifficultyColor() }]}>
              {difficulty}
            </Text>
          </View>
          {sets && reps && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {sets} sets × {reps} reps
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {/* Muscles */}
      {muscles && muscles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TARGET MUSCLES</Text>
          <View style={styles.muscleContainer}>
            {muscles.map((muscle, idx) => (
              <View key={idx} style={styles.muscleTag}>
                <Text style={styles.muscleText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Instructions */}
      {instructions && instructions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INSTRUCTIONS</Text>
          {instructions.map((instruction, idx) => (
            <View key={idx} style={styles.instructionRow}>
              <Text style={styles.instructionNumber}>{idx + 1}.</Text>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    gap: 8,
  },
  name: {
    ...textStyles.h3,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: `${darkTheme.color.primary}20`,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.color.primary,
  },
  description: {
    ...textStyles.body,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  section: {
    gap: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.2,
  },
  muscleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: `${darkTheme.color.primary}15`,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${darkTheme.color.primary}30`,
  },
  muscleText: {
    fontSize: 12,
    color: darkTheme.color.primary,
    fontWeight: '500',
  },
  instructionRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: darkTheme.color.primary,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});

