import { RootState } from '@/state/store';

// Templates selectors
export const selectMeasurementTemplates = (state: RootState) => state.measurements.templates;
export const selectTemplatesLoading = (state: RootState) => state.measurements.templatesLoading;
export const selectTemplatesError = (state: RootState) => state.measurements.templatesError;

// History selectors
export const selectMeasurementHistory = (state: RootState) => state.measurements.history;
export const selectHistoryLoading = (state: RootState) => state.measurements.historyLoading;
export const selectHistoryError = (state: RootState) => state.measurements.historyError;
export const selectHistoryPagination = (state: RootState) => state.measurements.historyPagination;

// Selected measurement selectors
export const selectSelectedMeasurement = (state: RootState) => state.measurements.selectedMeasurement;
export const selectSelectedMeasurementLoading = (state: RootState) => state.measurements.selectedMeasurementLoading;
export const selectSelectedMeasurementError = (state: RootState) => state.measurements.selectedMeasurementError;

// Field progress selectors
export const selectFieldProgress = (state: RootState) => state.measurements.fieldProgress;
export const selectFieldProgressLoading = (state: RootState) => state.measurements.fieldProgressLoading;
export const selectFieldProgressError = (state: RootState) => state.measurements.fieldProgressError;

// Submit selectors
export const selectSubmitting = (state: RootState) => state.measurements.submitting;
export const selectSubmitError = (state: RootState) => state.measurements.submitError;

