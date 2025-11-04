import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Progress } from '@/components/common/Progress';
import { darkTheme } from '@/styles/theme';
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
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="restaurant" size={20} color={darkTheme.color.primary} />
            <Text style={styles.title}>Today's Meals</Text>
          </View>
          <Button
            variant="ghost"
            size="sm"
            title="View Plan"
            onPress={() => router.push('/nutrition-plan')}
          />
        </View>
        <View style={styles.mealsList}>
          <View style={styles.mealItem}>
            <View style={styles.mealContent}>
              <Text style={styles.mealName}>Breakfast</Text>
              <Text style={styles.mealDescription}>{breakfast.description}</Text>
            </View>
            <Text style={styles.mealCalories}>{breakfast.calories} cal</Text>
          </View>
          <View style={styles.mealItem}>
            <View style={styles.mealContent}>
              <Text style={styles.mealName}>Lunch</Text>
              <Text style={styles.mealDescription}>{lunch.description}</Text>
            </View>
            <Text style={styles.mealCalories}>{lunch.calories} cal</Text>
          </View>
          <View style={[styles.mealItem, styles.mealItemDisabled]}>
            <View style={styles.mealContent}>
              <Text style={styles.mealName}>Dinner</Text>
              <Text style={styles.mealDescription}>{dinner.description}</Text>
            </View>
            <Text style={styles.mealCalories}>-</Text>
          </View>
        </View>
        <View style={styles.caloriesFooter}>
          <View style={styles.caloriesHeader}>
            <Text style={styles.caloriesLabel}>Calories</Text>
            <Text style={styles.caloriesValue}>
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
  mealsList: {
    gap: 12,
    marginBottom: 16,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    backgroundColor: `${darkTheme.color.secondary}4D`, // 30% opacity
  },
  mealItemDisabled: {
    opacity: 0.6,
  },
  mealContent: {
    flex: 1,
  },
  mealName: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
  },
  caloriesFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: darkTheme.color.border,
    gap: 8,
  },
  caloriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloriesLabel: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
  },
  caloriesValue: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
  },
});

