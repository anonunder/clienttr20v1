import { createSlice } from '@reduxjs/toolkit';
import {
  toggleRecipeFavorite,
  fetchRecipeFavorites,
  toggleMealFavorite,
  fetchMealFavorites,
} from './nutrition-thunks';

export interface FavoriteRecipe {
  id: number;
  entityId: number;
  entityType: string;
  userId: number;
  companyId: number;
  createdAt: string;
}

export interface FavoriteMeal {
  id: number;
  entityId: number;
  entityType: string;
  userId: number;
  companyId: number;
  createdAt: string;
}

export interface NutritionState {
  // Recipe favorites
  favoriteRecipes: FavoriteRecipe[];
  recipeFavoriteStatus: Record<number, boolean>;
  recipeFavoritesLoading: boolean;
  recipeFavoritesError: string | null;
  
  // Meal favorites
  favoriteMeals: FavoriteMeal[];
  mealFavoriteStatus: Record<number, boolean>;
  mealFavoritesLoading: boolean;
  mealFavoritesError: string | null;
}

const initialState: NutritionState = {
  favoriteRecipes: [],
  recipeFavoriteStatus: {},
  recipeFavoritesLoading: false,
  recipeFavoritesError: null,
  
  favoriteMeals: [],
  mealFavoriteStatus: {},
  mealFavoritesLoading: false,
  mealFavoritesError: null,
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    clearRecipeFavorites: (state) => {
      state.favoriteRecipes = [];
      state.recipeFavoriteStatus = {};
      state.recipeFavoritesError = null;
    },
    clearMealFavorites: (state) => {
      state.favoriteMeals = [];
      state.mealFavoriteStatus = {};
      state.mealFavoritesError = null;
    },
  },
  extraReducers: (builder) => {
    // Toggle Recipe Favorite
    builder
      .addCase(toggleRecipeFavorite.pending, (state) => {
        state.recipeFavoritesLoading = true;
        state.recipeFavoritesError = null;
      })
      .addCase(toggleRecipeFavorite.fulfilled, (state, action) => {
        state.recipeFavoritesLoading = false;
        const { entityId, isFavorited } = action.payload;
        state.recipeFavoriteStatus[entityId] = isFavorited;
        
        if (isFavorited) {
          // Add to favorites if not already there
          const exists = state.favoriteRecipes.some((fav) => fav.entityId === entityId);
          if (!exists) {
            state.favoriteRecipes.push({
              id: Date.now(),
              entityId,
              entityType: 'recipe',
              userId: 0, // Will be set by backend
              companyId: 0,
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          // Remove from favorites
          state.favoriteRecipes = state.favoriteRecipes.filter(
            (fav) => fav.entityId !== entityId
          );
        }
      })
      .addCase(toggleRecipeFavorite.rejected, (state, action) => {
        state.recipeFavoritesLoading = false;
        state.recipeFavoritesError = action.error.message || 'Failed to toggle recipe favorite';
      });

    // Fetch Recipe Favorites
    builder
      .addCase(fetchRecipeFavorites.pending, (state) => {
        state.recipeFavoritesLoading = true;
        state.recipeFavoritesError = null;
      })
      .addCase(fetchRecipeFavorites.fulfilled, (state, action) => {
        state.recipeFavoritesLoading = false;
        state.favoriteRecipes = action.payload;
        
        // Build status map
        const statusMap: Record<number, boolean> = {};
        action.payload.forEach((fav: FavoriteRecipe) => {
          statusMap[fav.entityId] = true;
        });
        state.recipeFavoriteStatus = statusMap;
      })
      .addCase(fetchRecipeFavorites.rejected, (state, action) => {
        state.recipeFavoritesLoading = false;
        state.recipeFavoritesError = action.error.message || 'Failed to fetch recipe favorites';
      });

    // Toggle Meal Favorite
    builder
      .addCase(toggleMealFavorite.pending, (state) => {
        state.mealFavoritesLoading = true;
        state.mealFavoritesError = null;
      })
      .addCase(toggleMealFavorite.fulfilled, (state, action) => {
        state.mealFavoritesLoading = false;
        const { entityId, isFavorited } = action.payload;
        state.mealFavoriteStatus[entityId] = isFavorited;
        
        if (isFavorited) {
          // Add to favorites if not already there
          const exists = state.favoriteMeals.some((fav) => fav.entityId === entityId);
          if (!exists) {
            state.favoriteMeals.push({
              id: Date.now(),
              entityId,
              entityType: 'meal',
              userId: 0, // Will be set by backend
              companyId: 0,
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          // Remove from favorites
          state.favoriteMeals = state.favoriteMeals.filter(
            (fav) => fav.entityId !== entityId
          );
        }
      })
      .addCase(toggleMealFavorite.rejected, (state, action) => {
        state.mealFavoritesLoading = false;
        state.mealFavoritesError = action.error.message || 'Failed to toggle meal favorite';
      });

    // Fetch Meal Favorites
    builder
      .addCase(fetchMealFavorites.pending, (state) => {
        state.mealFavoritesLoading = true;
        state.mealFavoritesError = null;
      })
      .addCase(fetchMealFavorites.fulfilled, (state, action) => {
        state.mealFavoritesLoading = false;
        state.favoriteMeals = action.payload;
        
        // Build status map
        const statusMap: Record<number, boolean> = {};
        action.payload.forEach((fav: FavoriteMeal) => {
          statusMap[fav.entityId] = true;
        });
        state.mealFavoriteStatus = statusMap;
      })
      .addCase(fetchMealFavorites.rejected, (state, action) => {
        state.mealFavoritesLoading = false;
        state.mealFavoritesError = action.error.message || 'Failed to fetch meal favorites';
      });
  },
});

export const { clearRecipeFavorites, clearMealFavorites } = nutritionSlice.actions;
export default nutritionSlice.reducer;

