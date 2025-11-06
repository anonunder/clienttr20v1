import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { ExerciseDetail } from './exercise-slice';

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
