import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';
import { textStyles, layoutStyles } from '@/styles/shared-styles';
import { env } from '@/config/env';
import { MacrosDisplay } from './MacrosDisplay';
import { RecipeList } from './RecipeList';
import { MealRecipe } from '@/features/programs/programs-slice';
import { useResponsive } from '@/hooks/use-responsive';

interface MealCardProps {
  id: number | string;
  name: string;
  image: string | null;
  time?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealRecipes?: MealRecipe[];
  onPress?: () => void;
  onRecipePress?: (recipe: MealRecipe, index: number) => void;
}

// Construct image URL from storage path
const getImageUrl = (imageUri: string | null | undefined): string => {
  if (!imageUri) {
    return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80';
  }
  
  if (imageUri.startsWith('http')) {
    return imageUri;
  }
  
  const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
  const imagePath = imageUri.startsWith('/') ? imageUri : `/${imageUri}`;
  
  return `${baseUrl}${imagePath}`;
};

export function MealCard({
  name,
  image,
  time,
  calories,
  protein,
  carbs,
  fat,
  mealRecipes = [],
  onPress,
  onRecipePress,
}: MealCardProps) {
  const { isMobile, isTablet } = useResponsive();
  const imageUrl = getImageUrl(image);
  const hasRecipes = mealRecipes && mealRecipes.length > 0;
  const hasMacros = protein !== undefined && carbs !== undefined && fat !== undefined;
  
  // State for collapsing/expanding recipes
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Responsive image sizing and layout
  const imageDimensions = useMemo(() => {
    if (isMobile) {
      // Smaller square image on mobile for list view
      return { width: 96, height: 96 };
    }
    if (isTablet) {
      return { width: 100, height: 100 };
    }
    return { width: 120, height: 120 };
  }, [isMobile, isTablet]);
  
  const containerStyle = useMemo(() => ({
    flexDirection: 'row' as const,
    gap: isMobile ? 12 : 16,
  }), [isMobile]);

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={onPress} style={styles.pressable} disabled={!onPress}>
        <Card>
          <View style={[styles.container, containerStyle]}>
            {/* Image */}
            <View style={[styles.imageContainer, imageDimensions]}>
              <Image 
                source={{ uri: imageUrl }} 
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2}>
                  {name}
                </Text>
                {hasRecipes && (
                  <Pressable 
                    onPress={() => setIsExpanded(!isExpanded)}
                    style={styles.expandButton}
                  >
                    <View style={styles.recipesBadge}>
                      <Text style={styles.recipesText}>
                        {mealRecipes.length} {mealRecipes.length === 1 ? 'recipe' : 'recipes'}
                      </Text>
                      <Ionicons 
                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                        size={16} 
                        color={darkTheme.color.mutedForeground} 
                      />
                    </View>
                  </Pressable>
                )}
              </View>
              
              {/* Time and Calories */}
              {(time || calories !== undefined) && (
                <View style={styles.meta}>
                  {time && (
                    <>
                      <View style={layoutStyles.rowCenterGap8}>
                        <Ionicons name="time-outline" size={14} color={darkTheme.color.mutedForeground} />
                        <Text style={styles.metaText}>{time}</Text>
                      </View>
                      {calories !== undefined && <Text style={styles.metaSeparator}>•</Text>}
                    </>
                  )}
                  {calories !== undefined && (
                    <View style={layoutStyles.rowCenterGap8}>
                      <Ionicons name="flame-outline" size={14} color={darkTheme.color.mutedForeground} />
                      <Text style={styles.metaText}>{calories} cal</Text>
                    </View>
                  )}
                </View>
              )}
              
              {/* Macros Display */}
              {hasMacros && (
                <View style={styles.macrosContainer}>
                  <MacrosDisplay 
                    protein={protein!}
                    carbs={carbs!}
                    fat={fat!}
                    size="sm"
                  />
                </View>
              )}
            </View>
          </View>
        </Card>
      </Pressable>

      {/* Recipe List - Collapsible */}
      {hasRecipes && isExpanded && (
        <RecipeList 
          recipes={mealRecipes}
          onRecipePress={onRecipePress}
          showHeader={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  pressable: {
    width: '100%',
  },
  container: {
    overflow: 'hidden',
  },
  imageContainer: {
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 8,
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    ...textStyles.body,
    fontWeight: '600',
    flex: 1,
  },
  expandButton: {
    flexShrink: 0,
  },
  recipesBadge: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: `${darkTheme.color.primary}4D`,
    backgroundColor: `${darkTheme.color.primary}1A`,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  recipesText: {
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.color.primary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  metaSeparator: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  macrosContainer: {
    marginTop: 4,
  },
});

