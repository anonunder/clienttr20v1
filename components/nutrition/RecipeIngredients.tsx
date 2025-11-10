import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';

interface RecipeIngredientsProps {
  ingredients: Array<{
    order: number;
    foodName: string;
    measurement: string;
    servings: number;
  }>;
}

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingredients</Text>
      <View style={styles.list}>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.item}>
            <Ionicons name="checkmark-circle" size={20} color={darkTheme.color.primary} />
            <Text style={styles.itemText}>
              {ingredient.servings} {ingredient.measurement} {ingredient.foodName}
            </Text>
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
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  itemText: {
    ...textStyles.body,
    flex: 1,
    color: darkTheme.color.foreground,
  },
});

