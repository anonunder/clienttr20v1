import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProgramsList, fetchProgramDetail, fetchTrainingPlan } from './programs-thunks';

// Types matching API response
export interface TrainingPlan {
  id: string;
  title: string;
}

// Training Plan Detail Types
export interface TrainingPlanMeta {
  meta_id: number;
  post_id: number;
  meta_key: string;
  meta_value: string;
}

export interface ReferencedMedia {
  id: number;
  post_content: string;
  PostMeta: {
    meta_id: number;
    post_id: number;
    meta_key: string;
    meta_value: string;
  };
}

export interface TrainingPlanWorkout {
  id: number;
  post_type: string;
  post_title: string;
  post_content: string;
  menu_order: number;
  post_parent: number;
  referencedMedia: ReferencedMedia[];
  meta: TrainingPlanMeta[];
  workoutExercises: any[];
}

export interface TrainingPlanDay {
  dayNumber: number;
  trainingPlanDayWorkouts: TrainingPlanWorkout[];
}

export interface TrainingPlanDetail {
  id: number;
  post_title: string;
  post_content: string;
  post_date: string;
  post_type: string;
  termTaxonomies: any[];
  meta: TrainingPlanMeta[];
  trainingPlanDays: TrainingPlanDay[];
  imageUri: string | null;
}

export interface NutritionPlan {
  id: string;
  title: string;
}

export interface Program {
  id: number;
  title: string;
  description: string;
  imageUri: string | null;
  duration: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  trainer: string;
  trainingPlan?: TrainingPlan | null;
  nutritionPlan?: NutritionPlan | null;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  autoRevealDays?: number | null;
  hasTrainingPlan: boolean;
  hasNutritionPlan: boolean;
  trainingPlanId?: string;
  nutritionPlanId?: string;
  clientId: string;
  dateAssigned: string;
  trainerId: number;
  createdAt: string;
  updatedAt: string | null;
}

interface ProgramsState {
  programs: Program[];
  programDetail: Program | null;
  trainingPlan: TrainingPlanDetail | null;
  loading: boolean;
  detailLoading: boolean;
  trainingPlanLoading: boolean;
  error: string | null;
  detailError: string | null;
  trainingPlanError: string | null;
  lastUpdated: number | null;
}

const initialState: ProgramsState = {
  programs: [],
  programDetail: null,
  trainingPlan: null,
  loading: false,
  detailLoading: false,
  trainingPlanLoading: false,
  error: null,
  detailError: null,
  trainingPlanError: null,
  lastUpdated: null,
};

const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    clearPrograms: (state) => {
      state.programs = [];
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgramsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramsList.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchProgramsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProgramDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProgramDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.programDetail = action.payload;
      })
      .addCase(fetchProgramDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      })
      .addCase(fetchTrainingPlan.pending, (state) => {
        state.trainingPlanLoading = true;
        state.trainingPlanError = null;
      })
      .addCase(fetchTrainingPlan.fulfilled, (state, action) => {
        state.trainingPlanLoading = false;
        state.trainingPlan = action.payload;
      })
      .addCase(fetchTrainingPlan.rejected, (state, action) => {
        state.trainingPlanLoading = false;
        state.trainingPlanError = action.payload as string;
      });
  },
});

export const { clearPrograms } = programsSlice.actions;
export default programsSlice.reducer;

