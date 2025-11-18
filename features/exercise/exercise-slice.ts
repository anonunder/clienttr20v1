import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchExerciseDetail, 
  toggleExerciseFavorite, 
  fetchExerciseFavorites,
  addExerciseComment,
  fetchExerciseComments,
} from './exercise-thunks';

// Types matching API response
export interface ExerciseSet {
  effort: {
    type: string;
    value: string;
  };
  intensity: {
    type: string;
    value: string;
  };
  rest: string;
}

export interface ExerciseMeta {
  description?: {
    text: string;
    editorState: string;
  };
  sets?: ExerciseSet[];
  source_exercise_term_taxonomy_id?: string;
  exercise?: string;
  exercise_thumbnail_media_id?: string;
  demo_media_id?: string;
}

export interface ExerciseTerm {
  name: string;
  date: string;
  meta: ExerciseMeta;
}

export interface ExerciseMedia {
  id: number;
  post_title: string;
  post_content: string;
  post_mime_type: string;
}

export interface AlternativeExercise {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  aspectRatio: '9:16' | '16:9';
  duration: number;
  restTime: number;
  sets: number;
  reps: number;
  isCircuit: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  muscles: string[];
  instructions: string[];
}

export interface ExerciseDetail {
  term_taxonomy_id: number;
  term_id: number;
  taxonomy: string;
  parent: number | null;
  author: number;
  description: string;
  post_parent: number;
  term: ExerciseTerm;
  parentTaxonomy: any | null;
  alternativeExercises: AlternativeExercise[];
  media: {
    demo_media_id?: ExerciseMedia;
    exercise_thumbnail_media_id?: ExerciseMedia;
  };
  workoutId: number;
  programId: number;
  trainingPlanId: number;
  isFavorited: boolean; // Added from backend
}

export interface ExerciseComment {
  userId: number;
  userName: string;
  userProfileImage?: string;
  date: string;
  comment: string;
}

export interface FavoriteStatus {
  isFavorited: boolean;
  totalFavorites?: number;
}

interface ExerciseState {
  exerciseDetail: ExerciseDetail | null;
  loading: boolean;
  error: string | null;
  // Favorites
  favoriteExercises: number[];
  favoriteStatus: { [exerciseId: number]: boolean };
  favoritesLoading: boolean;
  favoritesError: string | null;
  // Comments
  exerciseComments: { [exerciseId: number]: ExerciseComment[] };
  commentsLoading: boolean;
  commentsError: string | null;
}

const initialState: ExerciseState = {
  exerciseDetail: null,
  loading: false,
  error: null,
  // Favorites
  favoriteExercises: [],
  favoriteStatus: {},
  favoritesLoading: false,
  favoritesError: null,
  // Comments
  exerciseComments: {},
  commentsLoading: false,
  commentsError: null,
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    clearExercise: (state) => {
      state.exerciseDetail = null;
      state.error = null;
    },
    clearFavorites: (state) => {
      state.favoriteExercises = [];
      state.favoriteStatus = {};
      state.favoritesError = null;
    },
    clearComments: (state) => {
      state.exerciseComments = {};
      state.commentsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExerciseDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExerciseDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.exerciseDetail = action.payload;
      })
      .addCase(fetchExerciseDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle exercise favorite
      .addCase(toggleExerciseFavorite.pending, (state) => {
        state.favoritesLoading = true;
        state.favoritesError = null;
      })
      .addCase(toggleExerciseFavorite.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        const { exerciseId, isFavorited } = action.payload;
        state.favoriteStatus[exerciseId] = isFavorited;
        
        if (isFavorited) {
          if (!state.favoriteExercises.includes(exerciseId)) {
            state.favoriteExercises.push(exerciseId);
          }
        } else {
          state.favoriteExercises = state.favoriteExercises.filter(
            id => id !== exerciseId
          );
        }
      })
      .addCase(toggleExerciseFavorite.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.favoritesError = action.payload as string;
      })
      // Fetch exercise favorites
      .addCase(fetchExerciseFavorites.pending, (state) => {
        state.favoritesLoading = true;
        state.favoritesError = null;
      })
      .addCase(fetchExerciseFavorites.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.favoriteExercises = action.payload;
        // Update favorite status map
        action.payload.forEach(exerciseId => {
          state.favoriteStatus[exerciseId] = true;
        });
      })
      .addCase(fetchExerciseFavorites.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.favoritesError = action.payload as string;
      })
      // Add exercise comment
      .addCase(addExerciseComment.pending, (state) => {
        state.commentsLoading = true;
        state.commentsError = null;
      })
      .addCase(addExerciseComment.fulfilled, (state, action) => {
        state.commentsLoading = false;
        const { exerciseId, comment } = action.payload;
        if (!state.exerciseComments[exerciseId]) {
          state.exerciseComments[exerciseId] = [];
        }
        state.exerciseComments[exerciseId].unshift(comment);
      })
      .addCase(addExerciseComment.rejected, (state, action) => {
        state.commentsLoading = false;
        state.commentsError = action.payload as string;
      })
      // Fetch exercise comments
      .addCase(fetchExerciseComments.pending, (state) => {
        state.commentsLoading = true;
        state.commentsError = null;
      })
      .addCase(fetchExerciseComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        const { exerciseId, comments } = action.payload;
        state.exerciseComments[exerciseId] = comments;
      })
      .addCase(fetchExerciseComments.rejected, (state, action) => {
        state.commentsLoading = false;
        state.commentsError = action.payload as string;
      });
  },
});

export const { clearExercise, clearFavorites, clearComments } = exerciseSlice.actions;
export default exerciseSlice.reducer;

