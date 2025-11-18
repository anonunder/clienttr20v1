import { RootState } from '@/state/store';

export const selectActiveSessions = (state: RootState) => 
  state.workoutSession?.activeSessions || [];

export const selectCurrentSession = (state: RootState) => 
  state.workoutSession?.currentSession || null;

export const selectSessionHistory = (state: RootState) => 
  state.workoutSession?.sessionHistory || [];

export const selectSessionLoading = (state: RootState) => 
  state.workoutSession?.loading || false;

export const selectSessionDetailLoading = (state: RootState) => 
  state.workoutSession?.sessionLoading || false;

export const selectSessionHistoryLoading = (state: RootState) => 
  state.workoutSession?.historyLoading || false;

export const selectSessionError = (state: RootState) => 
  state.workoutSession?.error || null;

export const selectSessionDetailError = (state: RootState) => 
  state.workoutSession?.sessionError || null;

export const selectSessionHistoryError = (state: RootState) => 
  state.workoutSession?.historyError || null;

// Derived selectors
export const selectHasActiveSession = (state: RootState) => 
  state.workoutSession?.currentSession?.post_status === 'in_progress';

export const selectCurrentSessionExercises = (state: RootState) => 
  state.workoutSession?.currentSession?.exercises_completed || [];

export const selectCurrentSessionDuration = (state: RootState) => 
  state.workoutSession?.currentSession?.duration_minutes || 0;

