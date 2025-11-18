import { RootState } from '@/state/store';

// Recipe Favorites Selectors
export const selectFavoriteRecipes = (state: RootState) => 
  state.nutrition?.favoriteRecipes || [];

export const selectRecipeFavoriteStatus = (state: RootState) => 
  state.nutrition?.recipeFavoriteStatus || {};

export const selectRecipeFavoritesLoading = (state: RootState) => 
  state.nutrition?.recipeFavoritesLoading || false;

export const selectRecipeFavoritesError = (state: RootState) => 
  state.nutrition?.recipeFavoritesError || null;

// Meal Favorites Selectors
export const selectFavoriteMeals = (state: RootState) => 
  state.nutrition?.favoriteMeals || [];

export const selectMealFavoriteStatus = (state: RootState) => 
  state.nutrition?.mealFavoriteStatus || {};

export const selectMealFavoritesLoading = (state: RootState) => 
  state.nutrition?.mealFavoritesLoading || false;

export const selectMealFavoritesError = (state: RootState) => 
  state.nutrition?.mealFavoritesError || null;

