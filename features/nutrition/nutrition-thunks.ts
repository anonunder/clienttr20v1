import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';

// API Response Types
interface FavoriteApiResponse {
  success: boolean;
  data: {
    isFavorited: boolean;
    entityId: number;
    entityType: string;
  };
}

interface FavoritesListApiResponse {
  success: boolean;
  data: Array<{
    id: number;
    entityId: number;
    entityType: string;
    userId: number;
    companyId: number;
    createdAt: string;
  }>;
}

/**
 * Toggle Recipe Favorite
 */
export const toggleRecipeFavorite = createAsyncThunk(
  'nutrition/toggleRecipeFavorite',
  async ({ recipeId, companyId }: { recipeId: number; companyId: number }, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.favorites.toggle('recipe', recipeId);
      console.log('⭐ Toggling recipe favorite:', { recipeId, companyId });
      
      const response = await api<FavoriteApiResponse>(endpoint, {
        method: 'POST',
        body: { companyId },
      });
      
      if (!response.success) {
        throw new Error('Failed to toggle recipe favorite');
      }
      
      return {
        entityId: recipeId,
        isFavorited: response.data.isFavorited,
      };
    } catch (error: any) {
      console.error('❌ Failed to toggle recipe favorite:', error);
      return rejectWithValue(error.message || 'Failed to toggle recipe favorite');
    }
  }
);

/**
 * Fetch Recipe Favorites
 */
export const fetchRecipeFavorites = createAsyncThunk(
  'nutrition/fetchRecipeFavorites',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.favorites.listByType('recipe', companyId);
      console.log('🌐 Fetching recipe favorites from:', endpoint);
      
      const response = await api<FavoritesListApiResponse>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch recipe favorites');
      }
      
      console.log('✅ Recipe favorites fetched:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch recipe favorites:', error);
      return rejectWithValue(error.message || 'Failed to fetch recipe favorites');
    }
  }
);

/**
 * Toggle Meal Favorite
 */
export const toggleMealFavorite = createAsyncThunk(
  'nutrition/toggleMealFavorite',
  async ({ mealId, companyId }: { mealId: number; companyId: number }, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.favorites.toggle('meal', mealId);
      console.log('⭐ Toggling meal favorite:', { mealId, companyId });
      
      const response = await api<FavoriteApiResponse>(endpoint, {
        method: 'POST',
        body: { companyId },
      });
      
      if (!response.success) {
        throw new Error('Failed to toggle meal favorite');
      }
      
      console.log('✅ Meal favorite toggled:', response.data);
      return {
        entityId: mealId,
        isFavorited: response.data.isFavorited,
      };
    } catch (error: any) {
      console.error('❌ Failed to toggle meal favorite:', error);
      return rejectWithValue(error.message || 'Failed to toggle meal favorite');
    }
  }
);

/**
 * Fetch Meal Favorites
 */
export const fetchMealFavorites = createAsyncThunk(
  'nutrition/fetchMealFavorites',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.favorites.listByType('meal', companyId);
      console.log('🌐 Fetching meal favorites from:', endpoint);
      
      const response = await api<FavoritesListApiResponse>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch meal favorites');
      }
      
      console.log('✅ Meal favorites fetched:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch meal favorites:', error);
      return rejectWithValue(error.message || 'Failed to fetch meal favorites');
    }
  }
);

