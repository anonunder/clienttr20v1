import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchMeasurementTemplates,
  submitMeasurement,
  fetchMeasurementHistory,
  fetchMeasurementById,
  fetchFieldProgress,
} from './measurements-thunks';
import type { MeasurementTemplate, MeasurementEntry, FieldProgress } from '@/types/measurements';

interface MeasurementsState {
  templates: MeasurementTemplate[];
  templatesLoading: boolean;
  templatesError: string | null;

  history: MeasurementEntry[];
  historyLoading: boolean;
  historyError: string | null;
  historyPagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  } | null;

  selectedMeasurement: MeasurementEntry | null;
  selectedMeasurementLoading: boolean;
  selectedMeasurementError: string | null;

  fieldProgress: FieldProgress | null;
  fieldProgressLoading: boolean;
  fieldProgressError: string | null;

  submitting: boolean;
  submitError: string | null;
}

const initialState: MeasurementsState = {
  templates: [],
  templatesLoading: false,
  templatesError: null,

  history: [],
  historyLoading: false,
  historyError: null,
  historyPagination: null,

  selectedMeasurement: null,
  selectedMeasurementLoading: false,
  selectedMeasurementError: null,

  fieldProgress: null,
  fieldProgressLoading: false,
  fieldProgressError: null,

  submitting: false,
  submitError: null,
};

const measurementsSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    clearSubmitError: (state) => {
      state.submitError = null;
    },
    clearSelectedMeasurement: (state) => {
      state.selectedMeasurement = null;
      state.selectedMeasurementError = null;
    },
    clearFieldProgress: (state) => {
      state.fieldProgress = null;
      state.fieldProgressError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Templates
    builder
      .addCase(fetchMeasurementTemplates.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(fetchMeasurementTemplates.fulfilled, (state, action: PayloadAction<MeasurementTemplate[]>) => {
        state.templatesLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchMeasurementTemplates.rejected, (state, action) => {
        state.templatesLoading = false;
        state.templatesError = action.payload as string;
      });

    // Submit Measurement
    builder
      .addCase(submitMeasurement.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitMeasurement.fulfilled, (state, action: PayloadAction<MeasurementEntry>) => {
        state.submitting = false;
        // Add to history
        state.history.unshift(action.payload);
      })
      .addCase(submitMeasurement.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as string;
      });

    // Fetch History
    builder
      .addCase(fetchMeasurementHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchMeasurementHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload.data;
        state.historyPagination = action.payload.pagination;
      })
      .addCase(fetchMeasurementHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload as string;
      });

    // Fetch Measurement by ID
    builder
      .addCase(fetchMeasurementById.pending, (state) => {
        state.selectedMeasurementLoading = true;
        state.selectedMeasurementError = null;
      })
      .addCase(fetchMeasurementById.fulfilled, (state, action: PayloadAction<MeasurementEntry>) => {
        state.selectedMeasurementLoading = false;
        state.selectedMeasurement = action.payload;
      })
      .addCase(fetchMeasurementById.rejected, (state, action) => {
        state.selectedMeasurementLoading = false;
        state.selectedMeasurementError = action.payload as string;
      });

    // Fetch Field Progress
    builder
      .addCase(fetchFieldProgress.pending, (state) => {
        state.fieldProgressLoading = true;
        state.fieldProgressError = null;
      })
      .addCase(fetchFieldProgress.fulfilled, (state, action: PayloadAction<FieldProgress>) => {
        state.fieldProgressLoading = false;
        state.fieldProgress = action.payload;
      })
      .addCase(fetchFieldProgress.rejected, (state, action) => {
        state.fieldProgressLoading = false;
        state.fieldProgressError = action.payload as string;
      });
  },
});

export const { clearSubmitError, clearSelectedMeasurement, clearFieldProgress } = measurementsSlice.actions;
export default measurementsSlice.reducer;

