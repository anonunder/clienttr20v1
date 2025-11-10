import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { Program, TrainingPlanDetail, NutritionPlanDetail, MealDetail, RecipeDetail } from './programs-slice';

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

