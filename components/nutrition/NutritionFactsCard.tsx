import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { MacrosDisplay } from '@/components/nutrition/MacrosDisplay';

interface NutritionFactsCardProps {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  servings?: number;
}

export function NutritionFactsCard({
  protein,
  carbs,
  fat,
  calories,
  servings = 1,
}: NutritionFactsCardProps) {
  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition Facts</Text>
          {servings && (
            <Text style={styles.servings}>Servings: {servings}</Text>
          )}
        </View>
        
        <View style={styles.caloriesRow}>
          <Text style={styles.caloriesLabel}>Calories</Text>
          <Text style={styles.caloriesValue}>{calories}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <MacrosDisplay
          protein={protein}
          carbs={carbs}
          fat={fat}
          size="lg"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...textStyles.h2,
    fontSize: 20,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  servings: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  caloriesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: '700',
    color: darkTheme.color.primary,
  },
  divider: {
    height: 1,
    backgroundColor: darkTheme.color.border,
  },
});

