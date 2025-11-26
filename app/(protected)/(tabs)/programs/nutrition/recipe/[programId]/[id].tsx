import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/programs/[programId]/PageHeader';
import { Loading } from '@/components/common/Loading';
import { Card } from '@/components/ui/Card';
import { ImageGallery } from '@/components/common/ImageGallery';
import { NutritionFactsCard } from '@/components/nutrition/NutritionFactsCard';
import { RecipeIngredients } from '@/components/nutrition/RecipeIngredients';
import { RecipeInstructions } from '@/components/nutrition/RecipeInstructions';
import { useRecipeDetail } from '@/hooks/programs/use-recipe-detail';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { MealIngredient } from '@/features/programs/programs-slice';
import { env } from '@/config/env';
import { useResponsive } from '@/hooks/use-responsive';

export default function RecipeDetailScreen() {
  const { programId, id } = useLocalSearchParams<{ programId: string; id: string }>();
  const router = useRouter();
  const { recipeDetail, loading, error } = useRecipeDetail(programId || '', id || '');
  const { isMobile, width } = useResponsive();

  // Helper to convert image path to full URL
  const getImageUrl = (imagePath: string | null | undefined): string | undefined => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith('http')) return imagePath;
    
    const baseUrl = env.apiBaseUrl.replace(/\/api\/?$/, '');
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${path}`;
  };

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

  const handleBack = () => {
    router.back();
  };

  // Parse Lexical editor state to HTML
  const parseLexicalToHtml = (editorState: string): string => {
    try {
      const parsed = JSON.parse(editorState);
      const root = parsed.root;
      
      if (!root || !root.children) return '';
      
      let html = '';
      
      root.children.forEach((node: any) => {
        if (node.type === 'paragraph' && node.children && node.children.length > 0) {
          let paragraphContent = '';
          
          node.children.forEach((child: any) => {
            if (child.type === 'text' && child.text) {
              let text = child.text;
              
              // Apply formatting
              if (child.format === 1) { // Bold
                text = `<strong>${text}</strong>`;
              } else if (child.format === 2) { // Italic
                text = `<em>${text}</em>`;
              }
              
              paragraphContent += text;
            }
          });
          
          if (paragraphContent.trim()) {
            html += `<p>${paragraphContent}</p>`;
          }
        }
      });
      
      return html;
    } catch (error) {
      console.error('Error parsing Lexical editor state:', error);
      return '';
    }
  };

  // Parse description from Lexical editor state
  const description = useMemo(() => {
    if (!recipeDetail?.term?.meta?.description?.editorState) return null;
    
    try {
      const html = parseLexicalToHtml(recipeDetail.term.meta.description.editorState);
      return html || null;
    } catch (error) {
      console.error('Error parsing description:', error);
      // Fallback to text if available
      return recipeDetail.term.meta.description.text || null;
    }
  }, [recipeDetail]);

  // Parse ingredients from JSON string
  const ingredients = useMemo(() => {
    if (!recipeDetail?.term?.meta?.ingredients) return [];
    try {
      return JSON.parse(recipeDetail.term.meta.ingredients) as MealIngredient[];
    } catch (error) {
      console.error('Error parsing ingredients:', error);
      return [];
    }
  }, [recipeDetail]);

  // Parse instructions (if available)
  const instructions = useMemo(() => {
    if (!recipeDetail?.term?.meta?.instructions) return [];
    try {
      const parsed = JSON.parse(recipeDetail.term.meta.instructions);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      // If not JSON, split by newlines
      return recipeDetail.term.meta.instructions.split('\n').filter(i => i.trim());
    }
  }, [recipeDetail]);

  // Calculate total macros from ingredients
  const totalMacros = useMemo(() => {
    return ingredients.reduce(
      (acc, ing) => ({
        calories: acc.calories + (ing.calories || 0),
        protein: acc.protein + (ing.protein || 0),
        carbs: acc.carbs + (ing.carbs || 0),
        fat: acc.fat + (ing.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [ingredients]);

  // Get recipe image from media
  const recipeImage = useMemo(() => {
    if (!recipeDetail?.media?.recipe_thumbnail_media_id?.post_content) {
      return undefined;
    }
    return getImageUrl(recipeDetail.media.recipe_thumbnail_media_id.post_content);
  }, [recipeDetail]);

  // Get demo images for gallery
  const demoImages = useMemo(() => {
    if (!recipeDetail?.media?.demo_media_id || !Array.isArray(recipeDetail.media.demo_media_id)) {
      return [];
    }
    const images = recipeDetail.media.demo_media_id.map(media => media.post_content);
    console.log('🍽️ Recipe demoImages:', {
      mediaCount: recipeDetail.media.demo_media_id.length,
      images,
      fullMedia: recipeDetail.media.demo_media_id
    });
    return images;
  }, [recipeDetail]);

  // Loading state
  if (loading || !recipeDetail) {
    return (
      <MainLayout title="Recipe" hideNavigation={false}>
        <Loading message="Loading recipe..." />
      </MainLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <MainLayout title="Recipe" hideNavigation={false}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={darkTheme.color.destructive} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </MainLayout>
    );
  }

  const subtitle = `${totalMacros.calories} cal • ${ingredients.length} ingredients`;

  return (
    <MainLayout title="" hideNavigation={false}>
      {/* Page Header - Full Width */}
      <View style={headerContainerStyle}>
        <PageHeader
          image={recipeImage}
          title={recipeDetail.term.name || 'Recipe'}
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
          {/* Nutrition Facts Card */}
          <NutritionFactsCard
            protein={Math.round(totalMacros.protein)}
            carbs={Math.round(totalMacros.carbs)}
            fat={Math.round(totalMacros.fat)}
            calories={Math.round(totalMacros.calories)}
            servings={1}
          />

          {/* Demo Images Gallery */}
          {demoImages.length > 0 && (
            <ImageGallery images={demoImages} title="Photos" />
          )}

          {/* Ingredients & Instructions Card */}
          <Card>
            <View style={styles.cardContent}>
              <RecipeIngredients ingredients={ingredients} />
              
              {instructions.length > 0 && (
                <>
                  <View style={styles.divider} />
                  <RecipeInstructions instructions={instructions} />
                </>
              )}
            </View>
          </Card>

          {/* Description if available */}
          {description && (
            <Card>
              <View style={styles.cardContent}>
                <Text style={styles.sectionTitle}>About</Text>
                <RenderHTML
                  contentWidth={width - 64}
                  source={{ html: description }}
                  baseStyle={{
                    color: darkTheme.color.foreground,
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                  tagsStyles={{
                    p: {
                      marginTop: 0,
                      marginBottom: 8,
                      color: darkTheme.color.foreground,
                    },
                    strong: {
                      color: darkTheme.color.foreground,
                      fontWeight: '600',
                    },
                    em: {
                      color: darkTheme.color.foreground,
                      fontStyle: 'italic',
                    },
                    ol: {
                      marginTop: 0,
                      marginBottom: 8,
                      paddingLeft: 20,
                    },
                    ul: {
                      marginTop: 0,
                      marginBottom: 8,
                      paddingLeft: 20,
                    },
                    li: {
                      marginBottom: 4,
                      color: darkTheme.color.foreground,
                    },
                  }}
                />
              </View>
            </Card>
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
    gap: 24,
  },
  divider: {
    height: 1,
    backgroundColor: darkTheme.color.border,
  },
  sectionTitle: {
    ...textStyles.h3,
    fontSize: 18,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
});

