import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { MealRecipe } from '@/features/programs/programs-slice';
import { useResponsive } from '@/hooks/use-responsive';

interface RecipeListProps {
  recipes: MealRecipe[];
  onRecipePress?: (recipe: MealRecipe, index: number) => void;
  showHeader?: boolean;
}

// Strip HTML tags from description
const stripHtml = (html: string | undefined): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

// Extract text excerpt from description
const getExcerpt = (text: string, wordLimit: number = 25): string => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(' ') + '...';
};

// Parse JSON meta value safely
const parseMetaValue = (value: string | undefined): any => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export function RecipeList({ recipes, onRecipePress, showHeader = true }: RecipeListProps) {
  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recipes</Text>
          <Text style={styles.headerCount}>{recipes.length}</Text>
        </View>
      )}
      
      <View style={styles.recipesList}>
        {recipes.map((recipe, index) => {
          const recipeName = recipe.term?.name || `Recipe ${index + 1}`;
          
          // Extract description from term.meta
          const descriptionData = recipe.term?.meta?.description;
          const rawDescription = descriptionData?.text || '';
          const recipeDescription = stripHtml(rawDescription);
          const recipeExcerpt = getExcerpt(recipeDescription);
          
          // Extract ingredients count from term.meta
          const ingredientsStr = recipe.term?.meta?.ingredients;
          const ingredients = parseMetaValue(ingredientsStr);
          const ingredientsCount = Array.isArray(ingredients) ? ingredients.length : 0;

          return (
            <RecipeItem
              key={recipe.term_taxonomy_id || index}
              index={index}
              recipeName={recipeName}
              recipeExcerpt={recipeExcerpt}
              ingredientsCount={ingredientsCount}
              onPress={() => onRecipePress?.(recipe, index)}
            />
          );
        })}
      </View>
    </View>
  );
}

// Separate component for recipe item
function RecipeItem({
  index,
  recipeName,
  recipeExcerpt,
  ingredientsCount,
  onPress,
}: {
  index: number;
  recipeName: string;
  recipeExcerpt: string;
  ingredientsCount: number;
  onPress: () => void;
}) {
  const { isMobile } = useResponsive();
  
  // Responsive layout
  const recipeContentStyle = useMemo(() => ({
    flexDirection: isMobile ? 'column' : 'row' as 'row' | 'column',
    gap: isMobile ? 10 : 12,
    alignItems: isMobile ? 'stretch' : 'center' as 'center' | 'stretch',
  }), [isMobile]);

  return (
    <Pressable
      style={styles.recipeItem}
      onPress={onPress}
    >
      <Card>
        <View style={[styles.recipeContent, recipeContentStyle]}>
          {/* Recipe Info */}
          <View style={styles.recipeInfo}>
            <View style={styles.recipeHeader}>
              <Text style={styles.recipeName} numberOfLines={isMobile ? 2 : 1}>
                {recipeName}
              </Text>
              <View style={styles.recipeNumber}>
                <Text style={styles.recipeNumberText}>{index + 1}</Text>
              </View>
            </View>
            
            {recipeExcerpt && (
              <Text style={styles.recipeDescription} numberOfLines={isMobile ? 3 : 2}>
                {recipeExcerpt}
              </Text>
            )}
            
            {ingredientsCount > 0 && (
              <View style={styles.recipeMeta}>
                <Ionicons name="nutrition-outline" size={14} color={darkTheme.color.mutedForeground} />
                <Text style={styles.recipeMetaText}>
                  {ingredientsCount} {ingredientsCount === 1 ? 'ingredient' : 'ingredients'}
                </Text>
              </View>
            )}
          </View>

          {/* Chevron - Only show on non-mobile */}
          {!isMobile && (
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={darkTheme.color.mutedForeground} 
            />
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  headerTitle: {
    ...textStyles.body,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  headerCount: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    backgroundColor: darkTheme.color.bgMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recipesList: {
    gap: 10,
  },
  recipeItem: {
    width: '100%',
  },
  recipeContent: {
    padding: 14,
  },
  recipeInfo: {
    flex: 1,
    gap: 6,
    width: '100%',
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  recipeName: {
    ...textStyles.body,
    fontWeight: '600',
    flex: 1,
    color: darkTheme.color.foreground,
  },
  recipeNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: darkTheme.color.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recipeNumberText: {
    ...textStyles.small,
    fontWeight: '700',
    color: darkTheme.color.primary,
    fontSize: 11,
  },
  recipeDescription: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    lineHeight: 18,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  recipeMetaText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    fontSize: 12,
  },
});

