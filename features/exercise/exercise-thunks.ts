import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { ExerciseDetail, ExerciseComment } from './exercise-slice';

// API Response structure
interface ExerciseApiResponse {
  success: boolean;
  data: ExerciseDetail;
}

interface WorkoutExercisesApiResponse {
  success: boolean;
  data: {
    exercises: ExerciseDetail[];
  };
}

interface FavoriteApiResponse {
  success: boolean;
  data: {
    isFavorited: boolean;
    totalFavorites?: number;
  };
}

interface FavoritesListApiResponse {
  success: boolean;
  data: number[];
}

interface CommentApiResponse {
  success: boolean;
  data: ExerciseComment;
}

interface CommentsListApiResponse {
  success: boolean;
  data: ExerciseComment[];
  count: number;
}

/**
 * Fetch Exercise Detail
 * 
 * @param params - Object with programId, workoutId, exerciseId, and companyId
 * @returns Promise<ExerciseDetail>
 */
export const fetchExerciseDetail = createAsyncThunk(
  'exercise/fetchDetail',
  async (
    { 
      programId, 
      workoutId, 
      exerciseId, 
      companyId 
    }: { 
      programId: number; 
      workoutId: number; 
      exerciseId: number; 
      companyId: number 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = endpoints.programs.exercise(programId, workoutId, exerciseId, companyId);
      console.log('🌐 Fetching exercise from:', endpoint);
      
      const response = await api<ExerciseApiResponse>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch exercise detail');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Exercise: Failed to fetch detail:', error);
      console.error('Request params:', { programId, workoutId, exerciseId, companyId });
      return rejectWithValue(error.message || 'Failed to fetch exercise detail');
    }
  }
);

/**
 * Toggle Exercise Favorite
 * 
 * @param params - Object with exerciseId and companyId
 * @returns Promise<{ exerciseId: number, isFavorited: boolean }>
 */
export const toggleExerciseFavorite = createAsyncThunk(
  'exercise/toggleFavorite',
  async (
    { 
      exerciseId, 
      companyId 
    }: { 
      exerciseId: number; 
      companyId: number 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = endpoints.favorites.toggle('exercise', exerciseId);
      console.log('⭐ Toggling exercise favorite:', { exerciseId, companyId });
      
      const response = await api<FavoriteApiResponse>(endpoint, {
        method: 'POST',
        body: { companyId },
      });
      
      if (!response.success) {
        throw new Error('Failed to toggle exercise favorite');
      }
      
      console.log('✅ Exercise favorite toggled:', response.data);
      return {
        exerciseId,
        isFavorited: response.data.isFavorited,
      };
    } catch (error: any) {
      console.error('❌ Exercise: Failed to toggle favorite:', error);
      return rejectWithValue(error.message || 'Failed to toggle exercise favorite');
    }
  }
);

/**
 * Fetch Exercise Favorites
 * 
 * @param companyId - Company ID
 * @returns Promise<number[]>
 */
export const fetchExerciseFavorites = createAsyncThunk(
  'exercise/fetchFavorites',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.favorites.listByType('exercise', companyId);
      console.log('📋 Fetching exercise favorites from:', endpoint);
      
      const response = await api<FavoritesListApiResponse>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch exercise favorites');
      }
      
      console.log('✅ Exercise favorites fetched:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Exercise: Failed to fetch favorites:', error);
      return rejectWithValue(error.message || 'Failed to fetch exercise favorites');
    }
  }
);

/**
 * Add Exercise Comment
 * 
 * @param params - Object with exerciseId, companyId, and comment text
 * @returns Promise<{ exerciseId: number, comment: ExerciseComment }>
 */
export const addExerciseComment = createAsyncThunk(
  'exercise/addComment',
  async (
    { 
      exerciseId, 
      companyId,
      comment 
    }: { 
      exerciseId: number; 
      companyId: number;
      comment: string;
    }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = endpoints.comments.add('exercise', exerciseId);
      console.log('💬 Adding exercise comment:', { exerciseId, companyId });
      
      const response = await api<CommentApiResponse>(endpoint, {
        method: 'POST',
        body: {
          companyId,
          comment,
        },
      });
      
      if (!response.success) {
        throw new Error('Failed to add exercise comment');
      }
      
      console.log('✅ Exercise comment added');
      return {
        exerciseId,
        comment: response.data,
      };
    } catch (error: any) {
      console.error('❌ Exercise: Failed to add comment:', error);
      return rejectWithValue(error.message || 'Failed to add exercise comment');
    }
  }
);

/**
 * Fetch Exercise Comments
 * 
 * @param params - Object with exerciseId and companyId
 * @returns Promise<{ exerciseId: number, comments: ExerciseComment[] }>
 */
export const fetchExerciseComments = createAsyncThunk(
  'exercise/fetchComments',
  async (
    { 
      exerciseId, 
      companyId 
    }: { 
      exerciseId: number; 
      companyId: number 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = endpoints.comments.list('exercise', exerciseId, companyId);
      console.log('📖 Fetching exercise comments from:', endpoint);
      
      const response = await api<CommentsListApiResponse>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch exercise comments');
      }
      
      console.log('✅ Exercise comments fetched:', response.data.length);
      return {
        exerciseId,
        comments: response.data,
      };
    } catch (error: any) {
      console.error('❌ Exercise: Failed to fetch comments:', error);
      return rejectWithValue(error.message || 'Failed to fetch exercise comments');
    }
  }
);

