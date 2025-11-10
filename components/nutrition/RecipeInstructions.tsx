import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

interface RecipeInstructionsProps {
  instructions: string[];
}

export function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  if (!instructions || instructions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instructions</Text>
      <View style={styles.list}>
        {instructions.map((instruction, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.itemText}>{instruction}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    ...textStyles.h3,
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  list: {
    gap: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: darkTheme.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: darkTheme.color.primaryForeground,
  },
  itemText: {
    ...textStyles.body,
    flex: 1,
    color: darkTheme.color.foreground,
    lineHeight: 24,
  },
});

