import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/data-display/SectionHeader';
import { Progress } from '@/components/ui/Progress';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, componentStyles, textStyles, borderStyles, layoutStyles } from '@/styles/shared-styles';
import { router } from 'expo-router';

export interface Meal {
  name: string;
  description: string;
  calories: number;
}

interface TodayMealsProps {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  totalCalories: number;
  targetCalories: number;
}

export function TodayMeals({
  breakfast,
  lunch,
  dinner,
  totalCalories,
  targetCalories,
}: TodayMealsProps) {
  return (
    <Card>
      <View style={styles.cardContent}>
        <SectionHeader
          icon="restaurant"
          title="Today's Meals"
          actionTitle="View Plan"
          onActionPress={() => {}}
        />
        <View style={styles.mealsList}>
          <View style={componentStyles.listItem}>
            <View style={layoutStyles.flex1}>
              <Text style={textStyles.smallMedium}>Breakfast</Text>
              <Text style={textStyles.smallMuted}>{breakfast.description}</Text>
            </View>
            <Text style={textStyles.smallMedium}>{breakfast.calories} cal</Text>
          </View>
          <View style={componentStyles.listItem}>
            <View style={layoutStyles.flex1}>
              <Text style={textStyles.smallMedium}>Lunch</Text>
              <Text style={textStyles.smallMuted}>{lunch.description}</Text>
            </View>
            <Text style={textStyles.smallMedium}>{lunch.calories} cal</Text>
          </View>
          <View style={[componentStyles.listItem, styles.mealItemDisabled]}>
            <View style={layoutStyles.flex1}>
              <Text style={textStyles.smallMedium}>Dinner</Text>
              <Text style={textStyles.smallMuted}>{dinner.description}</Text>
            </View>
            <Text style={textStyles.smallMedium}>-</Text>
          </View>
        </View>
        <View style={styles.caloriesFooter}>
          <View style={layoutStyles.rowBetween}>
            <Text style={textStyles.smallMuted}>Calories</Text>
            <Text style={textStyles.smallMedium}>
              {totalCalories} / {targetCalories}
            </Text>
          </View>
          <Progress value={(totalCalories / targetCalories) * 100} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    ...spacingStyles.p24,
  },
  mealsList: {
    gap: 12,
    ...spacingStyles.mb16,
  },
  mealItemDisabled: {
    opacity: 0.6,
  },
  caloriesFooter: {
    ...spacingStyles.pt12,
    ...borderStyles.borderTop,
    gap: 8,
  },
});

