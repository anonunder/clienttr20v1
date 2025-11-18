import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/state/store';
import {
  startWorkoutSession,
  updateWorkoutSession,
  fetchWorkoutSessions,
  fetchWorkoutSessionDetail,
  deleteWorkoutSession,
} from '@/features/workout-session/workout-session-thunks';
import {
  selectActiveSessions,
  selectCurrentSession,
  selectSessionHistory,
  selectSessionLoading,
  selectSessionDetailLoading,
  selectSessionHistoryLoading,
  selectSessionError,
  selectHasActiveSession,
  selectCurrentSessionExercises,
} from '@/features/workout-session/workout-session-selectors';
import {
  updateExerciseInSession,
  addExerciseToSession,
  updateSetInExercise,
  clearCurrentSession,
} from '@/features/workout-session/workout-session-slice';
import { SessionExercise, ExerciseSet } from '@/features/workout-session/workout-session-slice';

export const useWorkoutSession = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const activeSessions = useSelector(selectActiveSessions);
  const currentSession = useSelector(selectCurrentSession);
  const sessionHistory = useSelector(selectSessionHistory);
  const loading = useSelector(selectSessionLoading);
  const detailLoading = useSelector(selectSessionDetailLoading);
  const historyLoading = useSelector(selectSessionHistoryLoading);
  const error = useSelector(selectSessionError);
  const hasActiveSession = useSelector(selectHasActiveSession);
  const currentExercises = useSelector(selectCurrentSessionExercises);

  /**
   * Start a new workout session
   */
  const startSession = useCallback(
    async (workoutId: number, companyId: number) => {
      try {
        const result = await dispatch(
          startWorkoutSession({ workoutId, companyId })
        ).unwrap();
        console.log('✅ Session started successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to start session:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Update workout session with exercises and status
   */
  const updateSession = useCallback(
    async (params: {
      sessionId: number;
      companyId: number;
      status?: 'in_progress' | 'completed' | 'abandoned';
      finished_at?: string;
      duration_minutes?: number;
      difficulty_rating?: number;
      notes?: string;
      exercises_completed?: SessionExercise[];
    }) => {
      try {
        const result = await dispatch(updateWorkoutSession(params)).unwrap();
        console.log('✅ Session updated successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to update session:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Finish the current workout session
   */
  const finishSession = useCallback(
    async (params: {
      sessionId: number;
      companyId: number;
      duration_minutes?: number;
      difficulty_rating?: number;
      notes?: string;
    }) => {
      try {
        const finishedAt = new Date().toISOString();
        const result = await dispatch(
          updateWorkoutSession({
            ...params,
            status: 'completed',
            finished_at: finishedAt,
            exercises_completed: currentExercises,
          })
        ).unwrap();
        console.log('✅ Session finished successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to finish session:', error);
        throw error;
      }
    },
    [dispatch, currentExercises]
  );

  /**
   * Fetch all workout sessions
   */
  const fetchSessions = useCallback(
    async (companyId: number) => {
      try {
        const result = await dispatch(fetchWorkoutSessions(companyId)).unwrap();
        console.log('✅ Sessions fetched successfully');
        return result;
      } catch (error) {
        console.error('❌ Failed to fetch sessions:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Fetch session detail
   */
  const fetchSessionDetail = useCallback(
    async (sessionId: number, companyId: number) => {
      try {
        const result = await dispatch(
          fetchWorkoutSessionDetail({ sessionId, companyId })
        ).unwrap();
        console.log('✅ Session detail fetched successfully');
        return result;
      } catch (error) {
        console.error('❌ Failed to fetch session detail:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Delete a workout session
   */
  const deleteSession = useCallback(
    async (sessionId: number) => {
      try {
        await dispatch(deleteWorkoutSession(sessionId)).unwrap();
        console.log('✅ Session deleted successfully');
      } catch (error) {
        console.error('❌ Failed to delete session:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Update exercise in current session (local state)
   */
  const updateExercise = useCallback(
    (exerciseId: number, updates: Partial<SessionExercise>) => {
      dispatch(updateExerciseInSession({ exerciseId, updates }));
    },
    [dispatch]
  );

  /**
   * Add exercise to current session (local state)
   */
  const addExercise = useCallback(
    (exercise: SessionExercise) => {
      dispatch(addExerciseToSession(exercise));
    },
    [dispatch]
  );

  /**
   * Update set in exercise (local state)
   */
  const updateSet = useCallback(
    (exerciseId: number, setNumber: number, updates: Partial<ExerciseSet>) => {
      dispatch(updateSetInExercise({ exerciseId, setNumber, updates }));
    },
    [dispatch]
  );

  /**
   * Mark exercise as finished and switch to next
   */
  const finishExercise = useCallback(
    (exerciseId: number) => {
      const finishedAt = new Date().toISOString();
      dispatch(updateExerciseInSession({ 
        exerciseId, 
        updates: { finished_at: finishedAt } 
      }));
    },
    [dispatch]
  );

  /**
   * Start an exercise
   */
  const startExercise = useCallback(
    (exerciseId: number) => {
      const startedAt = new Date().toISOString();
      dispatch(updateExerciseInSession({ 
        exerciseId, 
        updates: { started_at: startedAt } 
      }));
    },
    [dispatch]
  );

  /**
   * Clear current session
   */
  const clearSession = useCallback(() => {
    dispatch(clearCurrentSession());
  }, [dispatch]);

  return {
    // State
    activeSessions,
    currentSession,
    sessionHistory,
    loading,
    detailLoading,
    historyLoading,
    error,
    hasActiveSession,
    currentExercises,
    // Actions
    startSession,
    updateSession,
    finishSession,
    fetchSessions,
    fetchSessionDetail,
    deleteSession,
    updateExercise,
    addExercise,
    updateSet,
    finishExercise,
    startExercise,
    clearSession,
  };
};

