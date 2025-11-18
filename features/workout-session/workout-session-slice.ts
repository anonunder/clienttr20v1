import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  startWorkoutSession, 
  updateWorkoutSession, 
  fetchWorkoutSessions, 
  fetchWorkoutSessionDetail,
  deleteWorkoutSession 
} from './workout-session-thunks';

// Types matching API response
export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface SessionExercise {
  exercise_id: number;
  exercise_name: string;
  started_at?: string;
  finished_at?: string;
  sets: ExerciseSet[];
}

export interface WorkoutSessionMeta {
  meta_key: string;
  meta_value: string;
}

export interface WorkoutSession {
  id: number;
  post_title: string;
  post_parent: number;  // Workout ID
  post_status: 'in_progress' | 'completed' | 'abandoned';
  post_date: string;
  post_modified?: string;
  meta: WorkoutSessionMeta[];
}

export interface WorkoutSessionDetail extends WorkoutSession {
  started_at?: string;
  finished_at?: string;
  duration_minutes?: number;
  difficulty_rating?: number;
  notes?: string;
  exercises_completed?: SessionExercise[];
}

interface WorkoutSessionState {
  activeSessions: WorkoutSession[];
  currentSession: WorkoutSessionDetail | null;
  sessionHistory: WorkoutSession[];
  loading: boolean;
  sessionLoading: boolean;
  historyLoading: boolean;
  error: string | null;
  sessionError: string | null;
  historyError: string | null;
}

const initialState: WorkoutSessionState = {
  activeSessions: [],
  currentSession: null,
  sessionHistory: [],
  loading: false,
  sessionLoading: false,
  historyLoading: false,
  error: null,
  sessionError: null,
  historyError: null,
};

const workoutSessionSlice = createSlice({
  name: 'workoutSession',
  initialState,
  reducers: {
    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.sessionError = null;
    },
    clearSessions: (state) => {
      state.activeSessions = [];
      state.sessionHistory = [];
      state.error = null;
      state.historyError = null;
    },
    // Local state updates for exercise completion
    updateExerciseInSession: (state, action: PayloadAction<{ 
      exerciseId: number; 
      updates: Partial<SessionExercise> 
    }>) => {
      if (state.currentSession?.exercises_completed) {
        const exerciseIndex = state.currentSession.exercises_completed.findIndex(
          ex => ex.exercise_id === action.payload.exerciseId
        );
        if (exerciseIndex !== -1) {
          state.currentSession.exercises_completed[exerciseIndex] = {
            ...state.currentSession.exercises_completed[exerciseIndex],
            ...action.payload.updates,
          };
        }
      }
    },
    addExerciseToSession: (state, action: PayloadAction<SessionExercise>) => {
      if (state.currentSession) {
        if (!state.currentSession.exercises_completed) {
          state.currentSession.exercises_completed = [];
        }
        state.currentSession.exercises_completed.push(action.payload);
      }
    },
    updateSetInExercise: (state, action: PayloadAction<{ 
      exerciseId: number; 
      setNumber: number; 
      updates: Partial<ExerciseSet> 
    }>) => {
      if (state.currentSession?.exercises_completed) {
        const exercise = state.currentSession.exercises_completed.find(
          ex => ex.exercise_id === action.payload.exerciseId
        );
        if (exercise) {
          const setIndex = exercise.sets.findIndex(
            set => set.setNumber === action.payload.setNumber
          );
          if (setIndex !== -1) {
            exercise.sets[setIndex] = {
              ...exercise.sets[setIndex],
              ...action.payload.updates,
            };
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Start workout session
      .addCase(startWorkoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startWorkoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
        // Add to active sessions
        state.activeSessions.push(action.payload);
      })
      .addCase(startWorkoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update workout session
      .addCase(updateWorkoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
        
        // If session is completed, move to history
        if (action.payload.post_status === 'completed' || action.payload.post_status === 'abandoned') {
          state.activeSessions = state.activeSessions.filter(
            s => s.id !== action.payload.id
          );
          if (!state.sessionHistory.find(s => s.id === action.payload.id)) {
            state.sessionHistory.unshift(action.payload);
          }
        }
      })
      .addCase(updateWorkoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch workout sessions
      .addCase(fetchWorkoutSessions.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchWorkoutSessions.fulfilled, (state, action) => {
        state.historyLoading = false;
        // Separate active and completed sessions
        state.activeSessions = action.payload.filter(
          s => s.post_status === 'in_progress'
        );
        state.sessionHistory = action.payload.filter(
          s => s.post_status === 'completed' || s.post_status === 'abandoned'
        );
      })
      .addCase(fetchWorkoutSessions.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload as string;
      })
      // Fetch workout session detail
      .addCase(fetchWorkoutSessionDetail.pending, (state) => {
        state.sessionLoading = true;
        state.sessionError = null;
      })
      .addCase(fetchWorkoutSessionDetail.fulfilled, (state, action) => {
        state.sessionLoading = false;
        state.currentSession = action.payload;
      })
      .addCase(fetchWorkoutSessionDetail.rejected, (state, action) => {
        state.sessionLoading = false;
        state.sessionError = action.payload as string;
      })
      // Delete workout session
      .addCase(deleteWorkoutSession.fulfilled, (state, action) => {
        // Remove from both active and history
        state.activeSessions = state.activeSessions.filter(
          s => s.id !== action.payload
        );
        state.sessionHistory = state.sessionHistory.filter(
          s => s.id !== action.payload
        );
        // Clear current session if it was deleted
        if (state.currentSession?.id === action.payload) {
          state.currentSession = null;
        }
      });
  },
});

export const { 
  clearCurrentSession, 
  clearSessions,
  updateExerciseInSession,
  addExerciseToSession,
  updateSetInExercise,
} = workoutSessionSlice.actions;

export default workoutSessionSlice.reducer;

