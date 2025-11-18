import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import {
  toggleExerciseFavorite,
  fetchExerciseFavorites,
} from '@/features/exercise/exercise-thunks';
import {
  toggleWorkoutFavorite,
  fetchWorkoutFavorites,
} from '@/features/programs/programs-thunks';
import {
  toggleRecipeFavorite,
  fetchRecipeFavorites,
  toggleMealFavorite,
  fetchMealFavorites,
} from '@/features/nutrition/nutrition-thunks';

/**
 * Custom hook for managing favorites (exercises, workouts, recipes, meals)
 */
export const useFavorites = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Exercise favorites state
  const favoriteExercises = useSelector(
    (state: RootState) => state.exercise?.favoriteExercises || []
  );
  const exerciseFavoriteStatus = useSelector(
    (state: RootState) => state.exercise?.favoriteStatus || {}
  );
  const exerciseFavoritesLoading = useSelector(
    (state: RootState) => state.exercise?.favoritesLoading || false
  );
  const exerciseFavoritesError = useSelector(
    (state: RootState) => state.exercise?.favoritesError || null
  );

  // Workout favorites state
  const favoriteWorkouts = useSelector(
    (state: RootState) => state.programs?.favoriteWorkouts || []
  );
  const workoutFavoriteStatus = useSelector(
    (state: RootState) => state.programs?.favoriteStatus || {}
  );
  const workoutFavoritesLoading = useSelector(
    (state: RootState) => state.programs?.favoritesLoading || false
  );
  const workoutFavoritesError = useSelector(
    (state: RootState) => state.programs?.favoritesError || null
  );

  // Recipe favorites state
  const favoriteRecipes = useSelector(
    (state: RootState) => state.nutrition?.favoriteRecipes || []
  );
  const recipeFavoriteStatus = useSelector(
    (state: RootState) => state.nutrition?.recipeFavoriteStatus || {}
  );
  const recipeFavoritesLoading = useSelector(
    (state: RootState) => state.nutrition?.recipeFavoritesLoading || false
  );
  const recipeFavoritesError = useSelector(
    (state: RootState) => state.nutrition?.recipeFavoritesError || null
  );

  // Meal favorites state
  const favoriteMeals = useSelector(
    (state: RootState) => state.nutrition?.favoriteMeals || []
  );
  const mealFavoriteStatus = useSelector(
    (state: RootState) => state.nutrition?.mealFavoriteStatus || {}
  );
  const mealFavoritesLoading = useSelector(
    (state: RootState) => state.nutrition?.mealFavoritesLoading || false
  );
  const mealFavoritesError = useSelector(
    (state: RootState) => state.nutrition?.mealFavoritesError || null
  );

  /**
   * Toggle exercise favorite
   */
  const toggleExercise = useCallback(
    async (exerciseId: number, companyId: number) => {
      try {
        const result = await dispatch(
          toggleExerciseFavorite({ exerciseId, companyId })
        ).unwrap();
        console.log('✅ Exercise favorite toggled:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to toggle exercise favorite:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Fetch exercise favorites
   */
  const fetchExercises = useCallback(
    async (companyId: number) => {
      try {
        const result = await dispatch(fetchExerciseFavorites(companyId)).unwrap();
        console.log('✅ Exercise favorites fetched:', result.length);
        return result;
      } catch (error) {
        console.error('❌ Failed to fetch exercise favorites:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Toggle workout favorite
   */
  const toggleWorkout = useCallback(
    async (workoutId: number, companyId: number) => {
      try {
        const result = await dispatch(
          toggleWorkoutFavorite({ workoutId, companyId })
        ).unwrap();
        console.log('✅ Workout favorite toggled:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to toggle workout favorite:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Fetch workout favorites
   */
  const fetchWorkouts = useCallback(
    async (companyId: number) => {
      try {
        const result = await dispatch(fetchWorkoutFavorites(companyId)).unwrap();
        console.log('✅ Workout favorites fetched:', result.length);
        return result;
      } catch (error) {
        console.error('❌ Failed to fetch workout favorites:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Check if exercise is favorited
   */
  const isExerciseFavorited = useCallback(
    (exerciseId: number) => {
      return exerciseFavoriteStatus[exerciseId] || false;
    },
    [exerciseFavoriteStatus]
  );

  /**
   * Check if workout is favorited
   */
  const isWorkoutFavorited = useCallback(
    (workoutId: number) => {
      return workoutFavoriteStatus[workoutId] || false;
    },
    [workoutFavoriteStatus]
  );

  /**
   * Toggle recipe favorite
   */
  const toggleRecipe = useCallback(
    async (recipeId: number, companyId: number) => {
      try {
        const result = await dispatch(
          toggleRecipeFavorite({ recipeId, companyId })
        ).unwrap();
        console.log('✅ Recipe favorite toggled:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to toggle recipe favorite:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Fetch recipe favorites
   */
  const fetchRecipes = useCallback(
    async (companyId: number) => {
      try {
        const result = await dispatch(fetchRecipeFavorites(companyId)).unwrap();
        console.log('✅ Recipe favorites fetched:', result.length);
        return result;
      } catch (error) {
        console.error('❌ Failed to fetch recipe favorites:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Check if recipe is favorited
   */
  const isRecipeFavorited = useCallback(
    (recipeId: number) => {
      return recipeFavoriteStatus[recipeId] || false;
    },
    [recipeFavoriteStatus]
  );

  /**
   * Toggle meal favorite
   */
  const toggleMeal = useCallback(
    async (mealId: number, companyId: number) => {
      try {
        const result = await dispatch(
          toggleMealFavorite({ mealId, companyId })
        ).unwrap();
        console.log('✅ Meal favorite toggled:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to toggle meal favorite:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Fetch meal favorites
   */
  const fetchMeals = useCallback(
    async (companyId: number) => {
      try {
        const result = await dispatch(fetchMealFavorites(companyId)).unwrap();
        console.log('✅ Meal favorites fetched:', result.length);
        return result;
      } catch (error) {
        console.error('❌ Failed to fetch meal favorites:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Check if meal is favorited
   */
  const isMealFavorited = useCallback(
    (mealId: number) => {
      return mealFavoriteStatus[mealId] || false;
    },
    [mealFavoriteStatus]
  );

  return {
    // Exercise favorites
    favoriteExercises,
    exerciseFavoriteStatus,
    exerciseFavoritesLoading,
    exerciseFavoritesError,
    toggleExercise,
    fetchExercises,
    isExerciseFavorited,
    
    // Workout favorites
    favoriteWorkouts,
    workoutFavoriteStatus,
    workoutFavoritesLoading,
    workoutFavoritesError,
    toggleWorkout,
    fetchWorkouts,
    isWorkoutFavorited,
    
    // Recipe favorites
    favoriteRecipes,
    recipeFavoriteStatus,
    recipeFavoritesLoading,
    recipeFavoritesError,
    toggleRecipe,
    fetchRecipes,
    isRecipeFavorited,
    
    // Meal favorites
    favoriteMeals,
    mealFavoriteStatus,
    mealFavoritesLoading,
    mealFavoritesError,
    toggleMeal,
    fetchMeals,
    isMealFavorited,
  };
};

