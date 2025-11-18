import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { WorkoutSession, WorkoutSessionDetail, SessionExercise } from './workout-session-slice';

// API Response structure
interface WorkoutSessionApiResponse {
  success: boolean;
  data: WorkoutSessionDetail;
}

interface WorkoutSessionsListApiResponse {
  success: boolean;
  data: WorkoutSession[];
}

interface DeleteSessionApiResponse {
  success: boolean;
  message: string;
}

/**
 * Start Workout Session
 * 
 * @param params - Object with workoutId and companyId
 * @returns Promise<WorkoutSessionDetail>
 */
export const startWorkoutSession = createAsyncThunk(
  'workoutSession/start',
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
      const endpoint = endpoints.workoutSessions.start();
      console.log('🏋️ Starting workout session:', { workoutId, companyId });
      
      const response = await api<WorkoutSessionApiResponse>(endpoint, {
        method: 'POST',
        body: {
          workoutId,
          companyId,
        },
      });
      
      if (!response.success) {
        throw new Error('Failed to start workout session');
      }
      
      console.log('✅ Workout session started:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ WorkoutSession: Failed to start:', error);
      console.error('Request params:', { workoutId, companyId });
      return rejectWithValue(error.message || 'Failed to start workout session');
    }
  }
);

/**
 * Update Workout Session
 * 
 * @param params - Object with sessionId, companyId, and update data
 * @returns Promise<WorkoutSessionDetail>
 */
export const updateWorkoutSession = createAsyncThunk(
  'workoutSession/update',
  async (
    { 
      sessionId, 
      companyId,
      status,
      finished_at,
      duration_minutes,
      difficulty_rating,
      notes,
      exercises_completed,
    }: { 
      sessionId: number; 
      companyId: number;
      status?: 'in_progress' | 'completed' | 'abandoned';
      finished_at?: string;
      duration_minutes?: number;
      difficulty_rating?: number;
      notes?: string;
      exercises_completed?: SessionExercise[];
    }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = endpoints.workoutSessions.update(sessionId);
      console.log('📝 Updating workout session:', { sessionId, companyId, status });
      
      const response = await api<WorkoutSessionApiResponse>(endpoint, {
        method: 'PUT',
        body: {
          companyId,
          status,
          finished_at,
          duration_minutes,
          difficulty_rating,
          notes,
          exercises_completed,
        },
      });
      
      if (!response.success) {
        throw new Error('Failed to update workout session');
      }
      
      console.log('✅ Workout session updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ WorkoutSession: Failed to update:', error);
      console.error('Request params:', { sessionId, companyId });
      return rejectWithValue(error.message || 'Failed to update workout session');
    }
  }
);

/**
 * Fetch Workout Sessions
 * 
 * @param companyId - Company ID (required)
 * @returns Promise<WorkoutSession[]>
 */
export const fetchWorkoutSessions = createAsyncThunk(
  'workoutSession/fetchList',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.workoutSessions.list(companyId);
      console.log('📊 Fetching workout sessions from:', endpoint);
      
      const response = await api<WorkoutSessionsListApiResponse>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch workout sessions');
      }
      
      console.log('✅ Workout sessions fetched:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ WorkoutSession: Failed to fetch list:', error);
      return rejectWithValue(error.message || 'Failed to fetch workout sessions');
    }
  }
);

/**
 * Fetch Workout Session Detail
 * 
 * @param params - Object with sessionId and companyId
 * @returns Promise<WorkoutSessionDetail>
 */
export const fetchWorkoutSessionDetail = createAsyncThunk(
  'workoutSession/fetchDetail',
  async (
    { 
      sessionId, 
      companyId 
    }: { 
      sessionId: number; 
      companyId: number 
    }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = endpoints.workoutSessions.detail(sessionId, companyId);
      console.log('🔍 Fetching workout session detail from:', endpoint);
      
      const response = await api<WorkoutSessionApiResponse>(endpoint);
      
      if (!response.success) {
        throw new Error('Failed to fetch workout session detail');
      }
      
      console.log('✅ Workout session detail fetched');
      return response.data;
    } catch (error: any) {
      console.error('❌ WorkoutSession: Failed to fetch detail:', error);
      console.error('Request params:', { sessionId, companyId });
      return rejectWithValue(error.message || 'Failed to fetch workout session detail');
    }
  }
);

/**
 * Delete Workout Session
 * 
 * @param sessionId - Session ID to delete
 * @returns Promise<number> - Returns deleted sessionId
 */
export const deleteWorkoutSession = createAsyncThunk(
  'workoutSession/delete',
  async (sessionId: number, { rejectWithValue }) => {
    try {
      const endpoint = endpoints.workoutSessions.delete(sessionId);
      console.log('🗑️ Deleting workout session:', sessionId);
      
      const response = await api<DeleteSessionApiResponse>(endpoint, {
        method: 'DELETE',
      });
      
      if (!response.success) {
        throw new Error('Failed to delete workout session');
      }
      
      console.log('✅ Workout session deleted');
      return sessionId;
    } catch (error: any) {
      console.error('❌ WorkoutSession: Failed to delete:', error);
      return rejectWithValue(error.message || 'Failed to delete workout session');
    }
  }
);

