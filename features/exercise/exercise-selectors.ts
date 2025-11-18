import { RootState } from '@/state/store';

export const selectExerciseDetail = (state: RootState) => state.exercise.exerciseDetail;
export const selectExerciseLoading = (state: RootState) => state.exercise.loading;
export const selectExerciseError = (state: RootState) => state.exercise.error;

// Favorites
export const selectFavoriteExercises = (state: RootState) => state.exercise?.favoriteExercises || [];
export const selectExerciseFavoriteStatus = (state: RootState) => state.exercise?.favoriteStatus || {};
export const selectExerciseFavoritesLoading = (state: RootState) => state.exercise?.favoritesLoading || false;
export const selectExerciseFavoritesError = (state: RootState) => state.exercise?.favoritesError || null;

// Comments
export const selectExerciseComments = (state: RootState) => state.exercise?.exerciseComments || {};
export const selectExerciseCommentsLoading = (state: RootState) => state.exercise?.commentsLoading || false;
export const selectExerciseCommentsError = (state: RootState) => state.exercise?.commentsError || null;


