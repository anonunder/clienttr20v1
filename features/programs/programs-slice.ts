import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProgramsList, fetchProgramDetail } from './programs-thunks';

// Types matching API response
export interface TrainingPlan {
  id: string;
  title: string;
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
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
  detailError: string | null;
  lastUpdated: number | null;
}

const initialState: ProgramsState = {
  programs: [],
  programDetail: null,
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
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
      });
  },
});

export const { clearPrograms } = programsSlice.actions;
export default programsSlice.reducer;

