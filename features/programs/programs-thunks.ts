import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { Program, TrainingPlanDetail, NutritionPlanDetail, MealDetail, RecipeDetail, WorkoutComment } from './programs-slice';

// API Response structure
interface ProgramsApiResponse {
  success: boolean;
  data: Program[];
  count: number;
}

interface ProgramDetailApiResponse {
  success: boolean;
  data: Program;
}

/**
 * Fetch Programs List
 * 
 * @param companyId - Company ID (required)
 * @returns Promise<Program[]>
 */
export const fetchProgramsList = createAsyncThunk(
  'programs/fetchList',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const response = await api<ProgramsApiResponse>(endpoints.programs.list(companyId));
      
      if (!response.success) {
        throw new Error('Failed to fetch programs');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch list:', error);
      return rejectWithValue(error.message || 'Failed to fetch programs');
    }
  }
);

/**
 * Fetch Program Detail
 * 
 * @param params - Object with id and companyId
 * @returns Promise<Program>
 */
export const fetchProgramDetail = createAsyncThunk(
  'programs/fetchDetail',
  async ({ id, companyId }: { id: number; companyId: number }, { rejectWithValue }) => {
    try {
      const response = await api<ProgramDetailApiResponse>(endpoints.programs.detail(id, companyId));
      
      if (!response.success) {
        throw new Error('Failed to fetch program detail');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch detail:', error);
      return rejectWithValue(error.message || 'Failed to fetch program detail');
    }
  }
);

/**
 * Fetch Training Plan
 * 
 * @param params - Object with programId and companyId
 * @returns Promise<TrainingPlanDetail>
 */
export const fetchTrainingPlan = createAsyncThunk(
  'programs/fetchTrainingPlan',
  async ({ programId, companyId }: { programId: number; companyId: number }, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.programs.training(programId, companyId);
      console.log('🌐 Fetching training plan from:', endpoint);
      
      const response = await api<{ success: boolean; data: TrainingPlanDetail }>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch training plan');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch training plan:', error);
      console.error('Request params:', { programId, companyId });
      return rejectWithValue(error.message || 'Failed to fetch training plan');
    }
  }
);

/**
 * Fetch Nutrition Plan
 * 
 * @param params - Object with programId and companyId
 * @returns Promise<NutritionPlanDetail>
 */
export const fetchNutritionPlan = createAsyncThunk(
  'programs/fetchNutritionPlan',
  async ({ programId, companyId }: { programId: number; companyId: number }, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.programs.nutrition(programId, companyId);
      console.log('🌐 Fetching nutrition plan from:', endpoint);
      
      const response = await api<{ success: boolean; data: NutritionPlanDetail }>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch nutrition plan');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch nutrition plan:', error);
      console.error('Request params:', { programId, companyId });
      return rejectWithValue(error.message || 'Failed to fetch nutrition plan');
    }
  }
);

/**
 * Fetch Meal Detail
 * 
 * @param params - Object with programId, mealId, and companyId
 * @returns Promise<MealDetail>
 */
export const fetchMealDetail = createAsyncThunk(
  'programs/fetchMealDetail',
  async ({ programId, mealId, companyId }: { programId: number; mealId: number; companyId: number }, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.programs.meal(programId, mealId, companyId);
      console.log('🌐 Fetching meal detail from:', endpoint);
      
      const response = await api<{ success: boolean; data: MealDetail }>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch meal detail');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch meal detail:', error);
      console.error('Request params:', { programId, mealId, companyId });
      return rejectWithValue(error.message || 'Failed to fetch meal detail');
    }
  }
);

/**
 * Fetch Recipe Detail
 * 
 * @param params - Object with programId, recipeId, and companyId
 * @returns Promise<RecipeDetail>
 */
export const fetchRecipeDetail = createAsyncThunk(
  'programs/fetchRecipeDetail',
  async ({ programId, recipeId, companyId }: { programId: number; recipeId: number; companyId: number }, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.programs.recipe(programId, recipeId, companyId);
      console.log('🌐 Fetching recipe detail from:', endpoint);
      
      const response = await api<{ success: boolean; data: RecipeDetail }>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch recipe detail');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch recipe detail:', error);
      console.error('Request params:', { programId, recipeId, companyId });
      return rejectWithValue(error.message || 'Failed to fetch recipe detail');
    }
  }
);

/**
 * Toggle Workout Favorite
 * 
 * @param params - Object with workoutId and companyId
 * @returns Promise<{ workoutId: number, isFavorited: boolean }>
 */
export const toggleWorkoutFavorite = createAsyncThunk(
  'programs/toggleWorkoutFavorite',
  async (
    { 
      workoutId, 
      companyId 
    }: { 
      workoutId: number; 
      companyId: number 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = endpoints.favorites.toggle('workout', workoutId);
      console.log('⭐ Toggling workout favorite:', { workoutId, companyId });
      
      const response = await api<{ success: boolean; data: { isFavorited: boolean } }>(endpoint, {
        method: 'POST',
        body: { companyId },
      });
      
      if (!response.success) {
        throw new Error('Failed to toggle workout favorite');
      }
      
      console.log('✅ Workout favorite toggled:', response.data);
      return {
        workoutId,
        isFavorited: response.data.isFavorited,
      };
    } catch (error: any) {
      console.error('❌ Programs: Failed to toggle workout favorite:', error);
      return rejectWithValue(error.message || 'Failed to toggle workout favorite');
    }
  }
);

/**
 * Fetch Workout Favorites
 * 
 * @param companyId - Company ID
 * @returns Promise<number[]>
 */
export const fetchWorkoutFavorites = createAsyncThunk(
  'programs/fetchWorkoutFavorites',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.favorites.listByType('workout', companyId);
      console.log('📋 Fetching workout favorites from:', endpoint);
      
      const response = await api<{ success: boolean; data: number[] }>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch workout favorites');
      }
      
      console.log('✅ Workout favorites fetched:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch workout favorites:', error);
      return rejectWithValue(error.message || 'Failed to fetch workout favorites');
    }
  }
);

/**
 * Add Workout Comment
 * 
 * @param params - Object with workoutId, companyId, and comment text
 * @returns Promise<{ workoutId: number, comment: WorkoutComment }>
 */
export const addWorkoutComment = createAsyncThunk(
  'programs/addWorkoutComment',
  async (
    { 
      workoutId, 
      companyId,
      comment 
    }: { 
      workoutId: number; 
      companyId: number;
      comment: string;
    }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = endpoints.comments.add('workout', workoutId);
      console.log('💬 Adding workout comment:', { workoutId, companyId });
      
      const response = await api<{ success: boolean; data: WorkoutComment }>(endpoint, {
        method: 'POST',
        body: {
          companyId,
          comment,
        },
      });
      
      if (!response.success) {
        throw new Error('Failed to add workout comment');
      }
      
      console.log('✅ Workout comment added');
      return {
        workoutId,
        comment: response.data,
      };
    } catch (error: any) {
      console.error('❌ Programs: Failed to add workout comment:', error);
      return rejectWithValue(error.message || 'Failed to add workout comment');
    }
  }
);

/**
 * Fetch Workout Comments
 * 
 * @param params - Object with workoutId and companyId
 * @returns Promise<{ workoutId: number, comments: WorkoutComment[] }>
 */
export const fetchWorkoutComments = createAsyncThunk(
  'programs/fetchWorkoutComments',
  async (
    { 
      workoutId, 
      companyId 
    }: { 
      workoutId: number; 
      companyId: number 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = endpoints.comments.list('workout', workoutId, companyId);
      console.log('📖 Fetching workout comments from:', endpoint);
      
      const response = await api<{ success: boolean; data: WorkoutComment[]; count: number }>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch workout comments');
      }
      
      console.log('✅ Workout comments fetched:', response.data.length);
      return {
        workoutId,
        comments: response.data,
      };
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch workout comments:', error);
      return rejectWithValue(error.message || 'Failed to fetch workout comments');
    }
  }
);


