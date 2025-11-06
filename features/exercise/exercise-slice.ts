import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchExerciseDetail } from './exercise-thunks';

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
}

interface ExerciseState {
  exerciseDetail: ExerciseDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExerciseState = {
  exerciseDetail: null,
  loading: false,
  error: null,
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    clearExercise: (state) => {
      state.exerciseDetail = null;
      state.error = null;
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
      });
  },
});

export const { clearExercise } = exerciseSlice.actions;
export default exerciseSlice.reducer;

