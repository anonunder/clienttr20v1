import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/programs/[programId]/PageHeader';
import { HorizontalDaySelector } from '@/components/training/HorizontalDaySelector';
import { Loading } from '@/components/common/Loading';
import { MealCard } from '@/components/nutrition/MealCard';
import { MacrosDisplay } from '@/components/nutrition/MacrosDisplay';
import { Card } from '@/components/ui/Card';
import { useNutritionPlan } from '@/hooks/programs/use-nutrition-plan';
import { darkTheme } from '@/styles/theme';
import { textStyles } from '@/styles/shared-styles';
import { NutritionPlanMeal } from '@/features/programs/programs-slice';
import { useResponsive } from '@/hooks/use-responsive';

/**
 * Nutrition Plan Screen
 * Displays nutrition plan details with optional day selector and meals
 */
export default function NutritionPlanScreen() {
  const { id, day } = useLocalSearchParams<{ id: string; day?: string }>();
  const router = useRouter();
  const { nutritionPlan, loading, error } = useNutritionPlan(id || '');
  const { isMobile, width } = useResponsive();
  
  // Initialize selected date - will be set to program start date when data loads
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Loading state for day change
  const [isDayLoading, setIsDayLoading] = useState(false);

  // Check if this is a day-based or meal-based plan
  const isByDay = useMemo(() => {
    if (!nutritionPlan?.post_mime_type) return false;
    return nutritionPlan.post_mime_type === 'days';
  }, [nutritionPlan?.post_mime_type]);

  const isByMealGroups = useMemo(() => {
    if (!nutritionPlan) return false;
    return !!nutritionPlan.nutritionPlanMealGroups && nutritionPlan.nutritionPlanMealGroups.length > 0;
  }, [nutritionPlan]);

  // Responsive header container styling - MUST be before early returns
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

  // Reset selected date when nutrition plan changes (switching between programs)
  useEffect(() => {
    if (nutritionPlan?.id) {
      // Clear selected date so it gets reset to the new program's start date
      setSelectedDate(null);
    }
  }, [nutritionPlan?.id]);

  // Set default selected date when nutrition plan loads
  useEffect(() => {
    // If day parameter is provided in URL, use it
    if (day && nutritionPlan?.program?.startDate) {
      const dayNumber = parseInt(day, 10);
      if (!isNaN(dayNumber) && dayNumber > 0) {
        const programStartDate = new Date(nutritionPlan.program.startDate);
        programStartDate.setHours(0, 0, 0, 0);
        
        // Calculate date for the given day number (day 1 = start date)
        const targetDate = new Date(programStartDate);
        targetDate.setDate(programStartDate.getDate() + (dayNumber - 1));
        
        console.log('🎯 Setting selected date from URL day parameter:', dayNumber, '→', targetDate.toISOString());
        setSelectedDate(targetDate);
        return; // Exit early, don't use default logic
      }
    }
    
    // Default logic: use program start date
    if (nutritionPlan?.program?.startDate && !selectedDate) {
      const programStartDate = new Date(nutritionPlan.program.startDate);
      programStartDate.setHours(0, 0, 0, 0);
      console.log('🎯 Setting initial selected date to program start date:', programStartDate.toISOString());
      setSelectedDate(programStartDate);
    }
  }, [day, nutritionPlan?.program?.startDate, nutritionPlan?.id, selectedDate]);

  // Get available day numbers (sorted)
  const availableDays = useMemo(() => {
    if (!nutritionPlan?.nutritionPlanDays) return [];
    return nutritionPlan.nutritionPlanDays
      .map(day => day.dayNumber)
      .sort((a, b) => a - b);
  }, [nutritionPlan]);

  // Get meals for selected day or all meals if not by day
  const selectedDayMeals: NutritionPlanMeal[] = useMemo(() => {
    if (!nutritionPlan) return [];

    // For meal group-based plans, collect all meals from all groups
    if (isByMealGroups && nutritionPlan.nutritionPlanMealGroups) {
      return nutritionPlan.nutritionPlanMealGroups.flatMap(group => group.nutritionPlanGroupMeals || []);
    }

    // For day-based plans without actual day data, collect all meals
    if (!isByDay && nutritionPlan.nutritionPlanDays) {
      return nutritionPlan.nutritionPlanDays.flatMap(day => day.nutritionPlanDayMeals || []);
    }

    // For day-based plans, find meals for selected date
    if (isByDay && nutritionPlan.nutritionPlanDays) {
      if (!nutritionPlan.program?.startDate || !availableDays.length || !selectedDate) {
        console.warn('⚠️ Missing required data:', {
          hasStartDate: !!nutritionPlan.program?.startDate,
          availableDays: availableDays.length,
          hasSelectedDate: !!selectedDate,
        });
        return [];
      }
      
      const programStartDate = new Date(nutritionPlan.program.startDate);
      programStartDate.setHours(0, 0, 0, 0);
      
      const selectedDateNormalized = new Date(selectedDate);
      selectedDateNormalized.setHours(0, 0, 0, 0);
      
      const dayDiff = Math.floor(
        (selectedDateNormalized.getTime() - programStartDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const selectedDayNumber = dayDiff + 1;
      
      console.log('🔍 Nutrition Day Selection:', {
        programStartDate: programStartDate.toISOString(),
        selectedDate: selectedDateNormalized.toISOString(),
        dayDiff,
        selectedDayNumber,
        availableDaysCount: availableDays.length,
        firstAvailableDay: availableDays[0],
        lastAvailableDay: availableDays[availableDays.length - 1],
      });
      
      const dayData = nutritionPlan.nutritionPlanDays.find(
        (d) => d.dayNumber === selectedDayNumber
      );
      
      if (!dayData) {
        console.warn('⚠️ No data found for day', selectedDayNumber);
      } else {
        console.log('✅ Found meals for day', selectedDayNumber, ':', dayData.nutritionPlanDayMeals.length, 'meals');
      }
      
      return dayData?.nutritionPlanDayMeals || [];
    }

    return [];
  }, [nutritionPlan, selectedDate, isByDay, isByMealGroups, availableDays]);

  // Calculate total macros for the day/plan
  const totalMacros = useMemo(() => {
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalCalories = 0;

    selectedDayMeals.forEach((meal) => {
      // Try to extract macros from meal recipes or meta
      meal.mealRecipes?.forEach((recipe) => {
        const ingredientsStr = recipe.term?.meta?.ingredients;
        if (ingredientsStr) {
          try {
            const ingredients = JSON.parse(ingredientsStr);
            if (Array.isArray(ingredients)) {
              ingredients.forEach(ing => {
                totalProtein += ing.protein || 0;
                totalCarbs += ing.carbs || 0;
                totalFat += ing.fat || 0;
                totalCalories += ing.calories || 0;
              });
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      });
    });

    return {
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat),
      calories: Math.round(totalCalories),
    };
  }, [selectedDayMeals]);

  // Get meal image
  const getMealImage = (meal: NutritionPlanMeal): string | null => {
    if (meal.referencedMedia && meal.referencedMedia.length > 0) {
      return meal.referencedMedia[0].post_content;
    }
    return null;
  };

  // Get nutrition plan image
  const getNutritionPlanImage = (): string | null => {
    if (nutritionPlan?.imageUri) {
      return nutritionPlan.imageUri;
    }
    return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80';
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(protected)/(tabs)/programs');
    }
  };

  const handleDateChange = async (date: Date) => {
    setIsDayLoading(true);
    setSelectedDate(date);
    // Small delay for smoother transition
    setTimeout(() => {
      setIsDayLoading(false);
    }, 150);
  };

  // Loading state
  if (loading && !nutritionPlan) {
    return (
      <MainLayout title="" hideNavigation={false}>
        <Loading message="Loading nutrition plan..." />
      </MainLayout>
    );
  }

  // Error state
  if (error || !nutritionPlan) {
    return (
      <MainLayout title="" hideNavigation={false}>
        <View style={styles.centerContainer}>
          <Ionicons name="restaurant-outline" size={48} color={darkTheme.color.mutedForeground} />
          <Text style={styles.errorText}>
            {error || 'Nutrition plan not found'}
          </Text>
        </View>
      </MainLayout>
    );
  }

  const imageUrl = getNutritionPlanImage();
  const duration = nutritionPlan.program?.duration || 
    (Array.isArray(nutritionPlan.meta) ? nutritionPlan.meta.find((m: any) => m.meta_key === 'duration')?.meta_value : null);
  const subtitle = isByDay && duration ? `${duration} days • ${selectedDayMeals.length} meals` : `${selectedDayMeals.length} meals`;

  return (
    <MainLayout title="" hideNavigation={false}>
      {/* Page Header - Full Width */}
      <View style={headerContainerStyle}>
        <PageHeader
          image={imageUrl ?? undefined}
          title={nutritionPlan.post_title || 'Nutrition Plan'}
          subtitle={subtitle}
          onBack={handleBack}
        >
          {totalMacros.calories > 0 && (
            <View style={styles.headerMeta}>
              <Ionicons name="flame-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.headerMetaText}>{totalMacros.calories} cal/day</Text>
            </View>
          )}
        </PageHeader>

        {/* Horizontal Day Selector - Below Header, Full Width */}
        {isByDay && selectedDate && nutritionPlan.program?.startDate && nutritionPlan.program?.endDate && (
          <HorizontalDaySelector
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            startDate={nutritionPlan.program.startDate}
            endDate={nutritionPlan.program.endDate}
            completedDates={new Set()}
          />
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Loading State */}
          {isDayLoading ? (
            <Loading message="Loading meals..." />
          ) : (
            <>
              {/* Daily Macros Card */}
              {totalMacros.protein > 0 && (
                <Card>
                  <View style={styles.macrosCard}>
                    <Text style={styles.sectionTitle}>Daily Macros</Text>
                    <MacrosDisplay
                      protein={totalMacros.protein}
                      carbs={totalMacros.carbs}
                      fat={totalMacros.fat}
                      size="lg"
                    />
                  </View>
                </Card>
              )}

              {/* Meal List */}
              <View style={styles.mealSection}>
                <Text style={styles.sectionTitle}>
                  {isByDay ? "Daily Meals" : "Meals"}
                </Text>
                <View style={styles.mealList}>
                  {selectedDayMeals.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons name="restaurant-outline" size={48} color={darkTheme.color.mutedForeground} />
                      <Text style={styles.emptyText}>No meals scheduled for this day</Text>
                    </View>
                  ) : (
                    selectedDayMeals.map((meal: NutritionPlanMeal) => {
                      // Extract meal data
                      const mealImage = getMealImage(meal);
                      const timeMeta = meal.meta?.find(m => m.meta_key === 'time')?.meta_value;

                      return (
                        <MealCard
                          key={meal.id}
                          id={meal.id}
                          name={meal.post_title}
                          image={mealImage}
                          time={timeMeta}
                          mealRecipes={meal.mealRecipes}
                          onPress={() => {
                            router.push(`/programs/nutrition/meal/${id}/${meal.id}`);
                          }}
                          onRecipePress={(recipe) => {
                            // TODO: Navigate to recipe detail
                            console.log('Recipe pressed:', recipe.term_taxonomy_id);
                          }}
                        />
                      );
                    })
                  )}
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerMetaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  macrosCard: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    ...textStyles.h3,
    fontWeight: '700',
    color: darkTheme.color.foreground,
    marginBottom: 8,
  },
  mealSection: {
    gap: 12,
  },
  mealList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    gap: 16,
  },
  emptyText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
});

