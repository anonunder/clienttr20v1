import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import {
  addExerciseComment,
  fetchExerciseComments,
} from '@/features/exercise/exercise-thunks';
import {
  addWorkoutComment,
  fetchWorkoutComments,
} from '@/features/programs/programs-thunks';

/**
 * Custom hook for managing comments (exercises and workouts)
 */
export const useComments = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Exercise comments state
  const exerciseComments = useSelector(
    (state: RootState) => state.exercise?.exerciseComments || {}
  );
  const exerciseCommentsLoading = useSelector(
    (state: RootState) => state.exercise?.commentsLoading || false
  );
  const exerciseCommentsError = useSelector(
    (state: RootState) => state.exercise?.commentsError || null
  );

  // Workout comments state
  const workoutComments = useSelector(
    (state: RootState) => state.programs?.workoutComments || {}
  );
  const workoutCommentsLoading = useSelector(
    (state: RootState) => state.programs?.commentsLoading || false
  );
  const workoutCommentsError = useSelector(
    (state: RootState) => state.programs?.commentsError || null
  );

  /**
   * Add exercise comment
   */
  const addExercise = useCallback(
    async (exerciseId: number, companyId: number, comment: string) => {
      try {
        const result = await dispatch(
          addExerciseComment({ exerciseId, companyId, comment })
        ).unwrap();
        console.log('✅ Exercise comment added:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to add exercise comment:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Fetch exercise comments
   */
  const fetchExercise = useCallback(
    async (exerciseId: number, companyId: number) => {
      try {
        const result = await dispatch(
          fetchExerciseComments({ exerciseId, companyId })
        ).unwrap();
        console.log('✅ Exercise comments fetched:', result.comments.length);
        return result;
      } catch (error) {
        console.error('❌ Failed to fetch exercise comments:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Add workout comment
   */
  const addWorkout = useCallback(
    async (workoutId: number, companyId: number, comment: string) => {
      try {
        const result = await dispatch(
          addWorkoutComment({ workoutId, companyId, comment })
        ).unwrap();
        console.log('✅ Workout comment added:', result);
        return result;
      } catch (error) {
        console.error('❌ Failed to add workout comment:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Fetch workout comments
   */
  const fetchWorkout = useCallback(
    async (workoutId: number, companyId: number) => {
      try {
        const result = await dispatch(
          fetchWorkoutComments({ workoutId, companyId })
        ).unwrap();
        console.log('✅ Workout comments fetched:', result.comments.length);
        return result;
      } catch (error) {
        console.error('❌ Failed to fetch workout comments:', error);
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Get exercise comments by ID
   */
  const getExerciseComments = useCallback(
    (exerciseId: number) => {
      return exerciseComments[exerciseId] || [];
    },
    [exerciseComments]
  );

  /**
   * Get workout comments by ID
   */
  const getWorkoutComments = useCallback(
    (workoutId: number) => {
      return workoutComments[workoutId] || [];
    },
    [workoutComments]
  );

  return {
    // Exercise comments
    exerciseComments,
    exerciseCommentsLoading,
    exerciseCommentsError,
    addExercise,
    fetchExercise,
    getExerciseComments,
    
    // Workout comments
    workoutComments,
    workoutCommentsLoading,
    workoutCommentsError,
    addWorkout,
    fetchWorkout,
    getWorkoutComments,
  };
};

