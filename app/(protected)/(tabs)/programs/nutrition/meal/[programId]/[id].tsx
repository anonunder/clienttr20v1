import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/programs/[programId]/PageHeader';
import { Loading } from '@/components/common/Loading';
import { ImageGallery } from '@/components/common/ImageGallery';
import { Card } from '@/components/ui/Card';
import { MacrosDisplay } from '@/components/nutrition/MacrosDisplay';
import { RecipeCard } from '@/components/nutrition/RecipeCard';
import { useMealDetail } from '@/hooks/programs/use-meal-detail';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { MealIngredient, MealRecipe } from '@/features/programs/programs-slice';
import { env } from '@/config/env';
import { useResponsive } from '@/hooks/use-responsive';

/**
 * Meal Detail Screen
 * Displays meal information with recipes in a 2-column grid
 */
export default function MealDetailScreen() {
  const { programId, id } = useLocalSearchParams<{ programId: string; id: string }>();
  const router = useRouter();
  const { mealDetail, loading, error } = useMealDetail(programId || '', id || '');
  const { isMobile, width } = useResponsive();

  // Helper to convert image path to full URL
  const getImageUrl = (imagePath: string | null | undefined): string | undefined => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith('http')) return imagePath;
    
    const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${path}`;
  };

  // Calculate full-width header container styles
  const headerContainerStyle = useMemo(() => {
    const maxWidth = 1200;
    const padding = isMobile ? 12 : 16;
    
    const marginLeft = width > maxWidth 
      ? -(width - maxWidth) / 2 - padding
      : -padding;
    const marginRight = width > maxWidth
      ? -(width - maxWidth) / 2 - padding
      : -padding;
    
    return {
      width,
      marginTop: isMobile ? -24 : -32,
      marginLeft,
      marginRight,
      marginBottom: 0,
    };
  }, [width, isMobile]);

  // Extract meal data (only when mealDetail exists)
  const getMealImage = (): string | undefined => {
    if (!mealDetail) return undefined;
    
    const thumbnailMeta = mealDetail.meta?.find(m => m.meta_key === 'meal_thumbnail_media_id');
    
    if (thumbnailMeta?.meta_value) {
      // Find media item by ID (meta_value contains the media ID)
      const mediaId = parseInt(thumbnailMeta.meta_value, 10);
      const mediaItem = mealDetail.referencedMedia?.find(m => m.id === mediaId);
      
      if (mediaItem?.post_content) {
        return mediaItem.post_content;
      }
    }
    // Fallback to first media item
    return mealDetail.referencedMedia?.[0]?.post_content;
  };

  // Get all referenced media for gallery
  const galleryImages = useMemo(() => {
    if (!mealDetail?.referencedMedia) return [];
    return mealDetail.referencedMedia
      .filter(media => media.post_content)
      .map(media => media.post_content);
  }, [mealDetail?.referencedMedia]);

  const mealImage = getMealImage();
  const timeMeta = mealDetail?.meta?.find(m => m.meta_key === 'time')?.meta_value;

  // Calculate total macros from all recipes
  const totalMacros = useMemo(() => {
    if (!mealDetail?.mealRecipes) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    mealDetail.mealRecipes.forEach((recipe: MealRecipe) => {
      const ingredientsStr = recipe.term?.meta?.ingredients;
      if (ingredientsStr) {
        try {
          const ingredients: MealIngredient[] = JSON.parse(ingredientsStr);
          ingredients.forEach((ing: MealIngredient) => {
            totalCalories += ing.calories || 0;
            totalProtein += ing.protein || 0;
            totalCarbs += ing.carbs || 0;
            totalFat += ing.fat || 0;
          });
        } catch (error) {
          console.error('Error parsing ingredients:', error);
        }
      }
    });

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
    };
  }, [mealDetail?.mealRecipes]);

  // Get recipe image
  const getRecipeImage = (recipe: MealRecipe): string | null => {
    const thumbnailMediaId = recipe.term?.meta?.recipe_thumbnail_media_id;
    if (thumbnailMediaId && recipe.media?.recipe_thumbnail_media_id) {
      return recipe.media.recipe_thumbnail_media_id.post_content || null;
    }
    return null;
  };

  // Calculate recipe macros
  const getRecipeMacros = (recipe: MealRecipe) => {
    const ingredientsStr = recipe.term?.meta?.ingredients;
    if (!ingredientsStr) return null;

    try {
      const ingredients: MealIngredient[] = JSON.parse(ingredientsStr);
      const macros = ingredients.reduce(
        (acc, ing) => ({
          calories: acc.calories + (ing.calories || 0),
          protein: acc.protein + (ing.protein || 0),
          carbs: acc.carbs + (ing.carbs || 0),
          fat: acc.fat + (ing.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return {
        calories: Math.round(macros.calories),
        protein: Math.round(macros.protein),
        carbs: Math.round(macros.carbs),
        fat: Math.round(macros.fat),
      };
    } catch (error) {
      console.error('Error parsing recipe ingredients:', error);
      return null;
    }
  };

  const subtitle = useMemo(() => {
    const parts = [];
    if (timeMeta) parts.push(timeMeta);
    parts.push(`${totalMacros.calories} cal`);
    return parts.join(' • ');
  }, [timeMeta, totalMacros.calories]);

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (loading || !mealDetail) {
    return (
      <MainLayout title="Meal Detail" hideNavigation={false}>
        <Loading message="Loading meal details..." />
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout title="Meal Detail" hideNavigation={false}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={darkTheme.color.destructive} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="" hideNavigation={false}>
      {/* Page Header - Full Width */}
      <View style={headerContainerStyle}>
        <PageHeader
          image={getImageUrl(mealImage)}
          title={mealDetail.post_title || 'Meal'}
          subtitle={subtitle}
          onBack={handleBack}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Macros Card */}
          <Card>
            <View style={styles.cardContent}>
              <Text style={styles.sectionTitle}>Macros</Text>
              <MacrosDisplay
                protein={totalMacros.protein}
                carbs={totalMacros.carbs}
                fat={totalMacros.fat}
                size="lg"
              />
            </View>
          </Card>

          {/* Image Gallery */}
          {galleryImages.length > 0 && (
            <ImageGallery images={galleryImages} title="Photos" />
          )}

          {/* Recipes Section */}
          {mealDetail.mealRecipes && mealDetail.mealRecipes.length > 0 && (
            <View style={styles.recipesSection}>
              <Text style={styles.sectionTitle}>Recipes</Text>
              <View style={[styles.recipesGrid, isMobile && styles.recipesGridMobile]}>
                {mealDetail.mealRecipes.map((recipe: MealRecipe) => {
                  const recipeMacros = getRecipeMacros(recipe);
                  const recipeImage = getRecipeImage(recipe);

                  return (
                    <View 
                      key={recipe.term_taxonomy_id} 
                      style={[styles.recipeCardWrapper, isMobile && styles.recipeCardWrapperMobile]}
                    >
                      <RecipeCard
                        id={recipe.term_taxonomy_id}
                        title={recipe.term?.name || 'Recipe'}
                        image={recipeImage}
                        calories={recipeMacros?.calories}
                        protein={recipeMacros?.protein}
                        carbs={recipeMacros?.carbs}
                        fat={recipeMacros?.fat}
                        onPress={() => {
                          router.push(`/programs/nutrition/recipe/${programId}/${recipe.term_taxonomy_id}`);
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  errorText: {
    ...textStyles.body,
    color: darkTheme.color.destructive,
    textAlign: 'center',
  },
  cardContent: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    ...textStyles.h2,
    fontSize: 20,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  recipesSection: {
    gap: 16,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'flex-start',
  },
  recipesGridMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  recipeCardWrapper: {
    flex: 1,
    minWidth: 280,
    maxWidth: '48%',
  },
  recipeCardWrapperMobile: {
    maxWidth: '100%',
    width: '100%',
  },
});

