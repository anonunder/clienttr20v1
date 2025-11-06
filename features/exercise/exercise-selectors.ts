import { RootState } from '@/state/store';

export const selectExerciseDetail = (state: RootState) => state.exercise.exerciseDetail;
export const selectExerciseLoading = (state: RootState) => state.exercise.loading;
export const selectExerciseError = (state: RootState) => state.exercise.error;

