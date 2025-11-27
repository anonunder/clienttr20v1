import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/favorites/StatsCard';
import { FavoriteCard } from '@/components/favorites/FavoriteCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { darkTheme } from '@/styles/theme';
import { useFavorites } from '@/hooks/favorites/use-favorites';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { useResponsive } from '@/hooks/use-responsive';
import { FavoriteItem } from '@/types/favorites';
import { getDetailedFavorites } from '@/services/api-client/favorites-service';

/**
 * 💚 Favorites Screen
 * 
 * Displays user's favorite exercises, recipes, workouts, and meals
 * with tabs to filter by type and pagination
 */
export default function FavoritesScreen() {
  const { isTablet, isDesktop } = useResponsive();
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 12 items per page
  const [totalCounts, setTotalCounts] = useState({
    workouts: 0,
    meals: 0,
    recipes: 0,
    exercises: 0,
    foods: 0,
    programs: 0,
    training_plans: 0,
    nutrition_plans: 0,
  });

  // Get companyId from auth state
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);
  const companyId = selectedCompanyId ? parseInt(selectedCompanyId, 10) : null;

  // Get favorites data from Redux
  const {
    toggleExercise,
    toggleWorkout,
    toggleRecipe,
    toggleMeal,
  } = useFavorites();

  // Load favorites from API
  const loadFavorites = useCallback(async () => {
    if (!companyId) return;

    try {
      setLoading(true);
      
      // Calculate offset based on current page
      const offset = (currentPage - 1) * itemsPerPage;
      
      // Fetch detailed favorites from API with pagination
      const response = await getDetailedFavorites({ 
        companyId,
        limit: itemsPerPage,
        offset 
      });
      
      if (response.success) {
        // Store total counts for pagination
        setTotalCounts(response.pagination.totalCounts);
        const items: FavoriteItem[] = [];
        
        // Add exercises
        response.data.exercises?.forEach((exercise) => {
          // Create description from workout and program names
          const descriptionParts = [];
          if (exercise.workoutName) descriptionParts.push(exercise.workoutName);
          if (exercise.programName) descriptionParts.push(exercise.programName);
          const description = descriptionParts.length > 0 
            ? descriptionParts.join(' • ') 
            : (exercise.instructions || 'Exercise details');
          
          items.push({
            id: `exercise-${exercise.id}`,
            title: exercise.name,
            type: 'training',
            description,
            duration: exercise.duration ? `${Math.floor(exercise.duration / 60)} min` : undefined,
            difficulty: exercise.difficulty ? (exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)) as 'Beginner' | 'Intermediate' | 'Advanced' : undefined,
            entityType: 'exercise',
            entityId: exercise.id,
            isFavorited: exercise.isFavorited,
            thumbnailUrl: exercise.thumbnailUrl || undefined,
            videoUrl: exercise.videoUrl || undefined,
            programId: exercise.programId || undefined,
            programName: exercise.programName || undefined,
            workoutId: exercise.workoutId || undefined,
            workoutName: exercise.workoutName || undefined,
            trainingPlanId: exercise.trainingPlanId || undefined,
            trainingPlanName: exercise.trainingPlanName || undefined,
          });
        });
        
        // Add workouts
        response.data.workouts?.forEach((workout) => {
          items.push({
            id: `workout-${workout.id}`,
            title: workout.name,
            type: 'training',
            description: workout.description || 'Workout details',
            duration: workout.duration ? `${workout.duration} min` : undefined,
            difficulty: workout.difficulty ? (workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)) as 'Beginner' | 'Intermediate' | 'Advanced' : undefined,
            entityType: 'workout',
            entityId: workout.id,
            isFavorited: workout.isFavorited,
            thumbnailUrl: workout.thumbnailUrl || undefined,
          });
        });
        
        // Add recipes
        response.data.recipes?.forEach((recipe) => {
          const totalCalories = recipe.calories || 
            (recipe.ingredients?.reduce((sum, ing) => sum + ing.calories, 0) || 0);
          
          // Create description from meal and program names
          const descriptionParts = [];
          if (recipe.mealName) descriptionParts.push(recipe.mealName);
          if (recipe.programName) descriptionParts.push(recipe.programName);
          const description = descriptionParts.length > 0
            ? descriptionParts.join(' • ')
            : (recipe.instructions || `Recipe with ${recipe.ingredients?.length || 0} ingredients`);
          
          items.push({
            id: `recipe-${recipe.id}`,
            title: recipe.name,
            type: 'nutrition',
            description,
            calories: totalCalories,
            entityType: 'recipe',
            entityId: recipe.id,
            isFavorited: recipe.isFavorited,
            thumbnailUrl: recipe.thumbnailUrl || undefined,
            programId: recipe.programId || undefined,
            programName: recipe.programName || undefined,
            mealId: recipe.mealId || undefined,
            mealName: recipe.mealName || undefined,
            nutritionPlanId: recipe.nutritionPlanId || undefined,
            nutritionPlanName: recipe.nutritionPlanName || undefined,
          });
        });
        
        // Add meals
        response.data.meals?.forEach((meal) => {
          items.push({
            id: `meal-${meal.id}`,
            title: meal.name,
            type: 'nutrition',
            description: meal.description || `${meal.mealType} meal`,
            calories: meal.calories || undefined,
            entityType: 'meal',
            entityId: meal.id,
            isFavorited: meal.isFavorited,
          });
        });
        
        // Add foods
        response.data.foods?.forEach((food) => {
          items.push({
            id: `food-${food.id}`,
            title: food.name,
            type: 'nutrition',
            description: food.description || `${food.servingSize}${food.unit} serving`,
            calories: food.calories,
            entityType: 'food',
            entityId: food.id,
            isFavorited: food.isFavorited,
          });
        });
        
        // Add programs
        response.data.programs?.forEach((program) => {
          items.push({
            id: `program-${program.id}`,
            title: program.name,
            type: 'training',
            description: program.description || 'Training program',
            duration: `${program.duration} days`,
            difficulty: program.level ? (program.level.charAt(0).toUpperCase() + program.level.slice(1)) as 'Beginner' | 'Intermediate' | 'Advanced' : undefined,
            entityType: 'program',
            entityId: program.id,
            isFavorited: program.isFavorited,
            thumbnailUrl: program.thumbnailUrl || undefined,
          });
        });
        
        // Add training plans
        response.data.training_plans?.forEach((plan) => {
          items.push({
            id: `training_plan-${plan.id}`,
            title: plan.name,
            type: 'training',
            description: plan.description || `${plan.daysPerWeek} days/week training plan`,
            duration: `${plan.duration} days`,
            difficulty: plan.level ? (plan.level.charAt(0).toUpperCase() + plan.level.slice(1)) as 'Beginner' | 'Intermediate' | 'Advanced' : undefined,
            entityType: 'training_plan',
            entityId: plan.id,
            isFavorited: plan.isFavorited,
          });
        });
        
        // Add nutrition plans
        response.data.nutrition_plans?.forEach((plan) => {
          items.push({
            id: `nutrition_plan-${plan.id}`,
            title: plan.name,
            type: 'nutrition',
            description: plan.description || `${plan.caloriesTarget} cal/day nutrition plan`,
            calories: plan.caloriesTarget,
            entityType: 'nutrition_plan',
            entityId: plan.id,
            isFavorited: plan.isFavorited,
          });
        });
        
        setFavoriteItems(items);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      Alert.alert('Error', 'Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [companyId, currentPage, itemsPerPage]);

  const trainingFavorites = favoriteItems.filter(item => item.type === 'training');
  const nutritionFavorites = favoriteItems.filter(item => item.type === 'nutrition');

  // Calculate average rating (mock for now as API doesn't return ratings)
  const averageRating = '4.8';

  // Fetch favorites on mount or when page changes
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFavorites();
    setIsRefreshing(false);
  };

  // Handle unfavorite
  const handleUnfavorite = async (item: FavoriteItem) => {
    if (!companyId) return;

    try {
      switch (item.entityType) {
        case 'exercise':
          await toggleExercise(item.entityId, companyId);
          break;
        case 'workout':
        case 'training_plan_workout':
          await toggleWorkout(item.entityId, companyId);
          break;
        case 'recipe':
          await toggleRecipe(item.entityId, companyId);
          break;
        case 'meal':
        case 'nutrition_plan_meal':
          await toggleMeal(item.entityId, companyId);
          break;
      }
      
      // Reload favorites after toggling
      await loadFavorites();
    } catch (error) {
      console.error('Failed to unfavorite:', error);
      Alert.alert('Error', 'Failed to unfavorite item. Please try again.');
    }
  };

  // Handle view details - navigate to appropriate screen based on entity type
  const handleViewDetails = (item: FavoriteItem) => {
    try {
      switch (item.entityType) {
        case 'exercise':
          // Navigate to exercise details: /programs/training/{programId}/workout/{workoutId}/exercise/{exerciseId}
          if (item.programId && item.workoutId && item.entityId) {
            router.push(`/(protected)/(tabs)/programs/training/${item.programId}/workout/${item.workoutId}/exercise/${item.entityId}` as any);
          } else {
            Alert.alert('Info', 'Exercise details not available');
          }
          break;
          
        case 'workout':
        case 'training_plan_workout':
          // Navigate to workout details: /programs/training/{programId}/workout/{workoutId}
          if (item.programId && item.entityId) {
            router.push(`/(protected)/(tabs)/programs/training/${item.programId}/workout/${item.entityId}` as any);
          } else {
            Alert.alert('Info', 'Workout details not available');
          }
          break;
          
        case 'recipe':
          // Navigate to recipe details: /programs/nutrition/recipe/{programId}/{recipeId}
          if (item.programId && item.entityId) {
            router.push(`/(protected)/(tabs)/programs/nutrition/recipe/${item.programId}/${item.entityId}` as any);
          } else {
            Alert.alert('Info', 'Recipe details not available');
          }
          break;
          
        case 'meal':
        case 'nutrition_plan_meal':
          // Navigate to meal details: /programs/nutrition/{programId}/meal/{mealId}
          if (item.programId && item.entityId) {
            router.push(`/(protected)/(tabs)/programs/nutrition/${item.programId}/meal/${item.entityId}` as any);
          } else {
            Alert.alert('Info', 'Meal details not available');
          }
          break;
          
        case 'program':
        case 'program_assigned':
          // Navigate to program details
          router.push(`/(protected)/(tabs)/programs/${item.entityId}` as any);
          break;
          
        case 'training_plan':
        case 'training_plan_assigned':
          // Navigate to training plan
          if (item.programId) {
            router.push(`/(protected)/(tabs)/programs/training/${item.programId}` as any);
          } else {
            Alert.alert('Info', 'Training plan details not available');
          }
          break;
          
        case 'nutrition_plan':
        case 'nutrition_plan_assigned':
          // Navigate to nutrition plan
          if (item.programId) {
            router.push(`/(protected)/(tabs)/programs/nutrition/${item.programId}` as any);
          } else {
            Alert.alert('Info', 'Nutrition plan details not available');
          }
          break;
          
        default:
          console.log('Unknown entity type:', item.entityType);
          Alert.alert('Error', 'Unknown item type');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Failed to navigate to details');
    }
  };

  // Get items to display based on active tab
  const getDisplayItems = () => {
    switch (activeTab) {
      case 'training':
        return trainingFavorites;
      case 'nutrition':
        return nutritionFavorites;
      default:
        return favoriteItems;
    }
  };

  const displayItems = getDisplayItems();

  // Get number of columns for grid
  const numColumns = isDesktop ? 3 : isTablet ? 2 : 1;

  // Calculate total pages based on active tab
  const getTotalPages = () => {
    let totalItems = 0;
    
    switch (activeTab) {
      case 'training':
        totalItems = totalCounts.exercises + totalCounts.workouts + 
                    totalCounts.programs + totalCounts.training_plans;
        break;
      case 'nutrition':
        totalItems = totalCounts.recipes + totalCounts.meals + 
                    totalCounts.foods + totalCounts.nutrition_plans;
        break;
      default: // 'all'
        totalItems = Object.values(totalCounts).reduce((sum, count) => sum + count, 0);
    }
    
    return Math.ceil(totalItems / itemsPerPage);
  };

  const totalPages = getTotalPages();

  // Generate page numbers to display (max 7 pages visible)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Pagination component
  const renderPagination = () => {
    if (totalPages <= 1 || displayItems.length === 0) return null;

    return (
      <View style={styles.paginationContainer}>
        {/* Previous button */}
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled
          ]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Ionicons 
            name="chevron-back" 
            size={20} 
            color={currentPage === 1 ? darkTheme.color.mutedForeground : darkTheme.color.foreground} 
          />
        </TouchableOpacity>

        {/* Page numbers */}
        <View style={styles.pageNumbersContainer}>
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <View key={`ellipsis-${index}`} style={styles.paginationEllipsis}>
                  <Text style={styles.paginationEllipsisText}>...</Text>
                </View>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <TouchableOpacity
                key={pageNumber}
                style={[
                  styles.paginationPageButton,
                  isActive && styles.paginationPageButtonActive
                ]}
                onPress={() => handlePageChange(pageNumber)}
              >
                <Text 
                  style={[
                    styles.paginationPageText,
                    isActive && styles.paginationPageTextActive
                  ]}
                >
                  {pageNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Next button */}
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={currentPage === totalPages ? darkTheme.color.mutedForeground : darkTheme.color.foreground} 
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <MainLayout 
      title="Favorites" 
      description="Quick access to your favorite workouts and meal plans"
      refreshControl={
        <RefreshControl 
          refreshing={isRefreshing} 
          onRefresh={handleRefresh}
          tintColor={darkTheme.color.primary}
        />
      }
    >
      <View style={styles.container}>
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart" size={32} color={darkTheme.color.primary} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.pageTitle}>Favorites</Text>
            <Text style={styles.pageDescription}>
              Quick access to your favorite workouts and meal plans
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={[
          styles.statsGrid,
          isTablet && styles.statsGridTablet,
          isDesktop && styles.statsGridDesktop,
        ]}>
          <StatsCard
            icon="barbell"
            iconColor={darkTheme.color.primary}
            label="Training Programs"
            value={trainingFavorites.length}
            subtitle="Saved workouts"
            subtitleIcon="trending-up"
            subtitleColor={darkTheme.color.success}
          />
          <StatsCard
            icon="nutrition"
            iconColor={darkTheme.color.success}
            label="Nutrition Plans"
            value={nutritionFavorites.length}
            subtitle="Meal plans"
            subtitleColor={darkTheme.color.mutedForeground}
          />
          <StatsCard
            icon="star"
            iconColor={darkTheme.color.warning}
            label="Average Rating"
            value={parseFloat(averageRating)}
            subtitle="Highly rated"
            subtitleColor={darkTheme.color.mutedForeground}
          />
        </View>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={styles.tabsList}>
            <TabsTrigger value="all">
              All ({favoriteItems.length})
            </TabsTrigger>
            <TabsTrigger value="training">
              Training ({trainingFavorites.length})
            </TabsTrigger>
            <TabsTrigger value="nutrition">
              Nutrition ({nutritionFavorites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {displayItems.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-outline" size={64} color={darkTheme.color.mutedForeground} />
                <Text style={styles.emptyText}>No favorites yet</Text>
                <Text style={styles.emptySubtext}>
                  Start adding your favorite workouts and meals
                </Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={displayItems}
                  key={`grid-${numColumns}`}
                  numColumns={numColumns}
                  renderItem={({ item }) => (
                    <View style={[
                      styles.cardWrapper,
                      numColumns > 1 && styles.cardWrapperGrid,
                      { width: numColumns > 1 ? `${100 / numColumns}%` : '100%' }
                    ]}>
                      <FavoriteCard 
                        item={item}
                        onUnfavorite={() => handleUnfavorite(item)}
                        onViewDetails={() => handleViewDetails(item)}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                  scrollEnabled={false}
                />
                {renderPagination()}
              </>
            )}
          </TabsContent>

          <TabsContent value="training">
            {trainingFavorites.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="barbell-outline" size={64} color={darkTheme.color.mutedForeground} />
                <Text style={styles.emptyText}>No training favorites</Text>
                <Text style={styles.emptySubtext}>
                  Add your favorite exercises and workouts
                </Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={trainingFavorites}
                  key={`training-grid-${numColumns}`}
                  numColumns={numColumns}
                  renderItem={({ item }) => (
                    <View style={[
                      styles.cardWrapper,
                      numColumns > 1 && styles.cardWrapperGrid,
                      { width: numColumns > 1 ? `${100 / numColumns}%` : '100%' }
                    ]}>
                      <FavoriteCard 
                        item={item}
                        onUnfavorite={() => handleUnfavorite(item)}
                        onViewDetails={() => handleViewDetails(item)}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                  scrollEnabled={false}
                />
                {renderPagination()}
              </>
            )}
          </TabsContent>

          <TabsContent value="nutrition">
            {nutritionFavorites.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="nutrition-outline" size={64} color={darkTheme.color.mutedForeground} />
                <Text style={styles.emptyText}>No nutrition favorites</Text>
                <Text style={styles.emptySubtext}>
                  Add your favorite recipes and meals
                </Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={nutritionFavorites}
                  key={`nutrition-grid-${numColumns}`}
                  numColumns={numColumns}
                  renderItem={({ item }) => (
                    <View style={[
                      styles.cardWrapper,
                      numColumns > 1 && styles.cardWrapperGrid,
                      { width: numColumns > 1 ? `${100 / numColumns}%` : '100%' }
                    ]}>
                      <FavoriteCard 
                        item={item}
                        onUnfavorite={() => handleUnfavorite(item)}
                        onViewDetails={() => handleViewDetails(item)}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                  scrollEnabled={false}
                />
                {renderPagination()}
              </>
            )}
          </TabsContent>
        </Tabs>

        {(loading && !isRefreshing) && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading favorites...</Text>
          </View>
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: `${darkTheme.color.primary}1A`, // 10% opacity
  },
  headerTextContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  pageDescription: {
    fontSize: 16,
    color: darkTheme.color.mutedForeground,
    marginTop: 4,
  },
  statsGrid: {
    gap: 16,
  },
  statsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statsGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  tabsList: {
    alignSelf: 'flex-start',
    minWidth: 300,
  },
  cardWrapper: {
    paddingHorizontal: 0,
  },
  cardWrapperGrid: {
    paddingHorizontal: 8,
  },
  listContent: {
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  emptySubtext: {
    fontSize: 16,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
    color: darkTheme.color.mutedForeground,
  },
  // Pagination styles
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 8,
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: darkTheme.color.card,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationButtonDisabled: {
    opacity: 0.4,
  },
  pageNumbersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  paginationPageButton: {
    minWidth: 40,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: darkTheme.color.card,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationPageButtonActive: {
    backgroundColor: darkTheme.color.primary,
    borderColor: darkTheme.color.primary,
  },
  paginationPageText: {
    fontSize: 14,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  paginationPageTextActive: {
    color: '#FFFFFF',
  },
  paginationEllipsis: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationEllipsisText: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
    fontWeight: '600',
  },
});
