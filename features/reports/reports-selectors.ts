import { RootState } from '@/state/store';
import { createSelector } from '@reduxjs/toolkit';

// Base selector
export const selectReportsState = (state: RootState) => state.reports;

// Pending reports
export const selectPendingReports = createSelector(
  [selectReportsState],
  (reports) => reports.pendingReports
);

// Completed reports
export const selectCompletedReports = createSelector(
  [selectReportsState],
  (reports) => reports.completedReports
);

// Selected report
export const selectSelectedReport = createSelector(
  [selectReportsState],
  (reports) => reports.selectedReport
);

// Pagination
export const selectCompletedPagination = createSelector(
  [selectReportsState],
  (reports) => reports.completedPagination
);

// Loading states
export const selectLoadingPending = createSelector(
  [selectReportsState],
  (reports) => reports.loadingPending
);

export const selectLoadingCompleted = createSelector(
  [selectReportsState],
  (reports) => reports.loadingCompleted
);

export const selectLoadingDetail = createSelector(
  [selectReportsState],
  (reports) => reports.loadingDetail
);

export const selectSubmitting = createSelector(
  [selectReportsState],
  (reports) => reports.submitting
);

export const selectIsLoading = createSelector(
  [selectReportsState],
  (reports) => 
    reports.loadingPending || 
    reports.loadingCompleted || 
    reports.loadingDetail ||
    reports.submitting
);

// Error states
export const selectError = createSelector(
  [selectReportsState],
  (reports) => reports.error
);

export const selectSubmitError = createSelector(
  [selectReportsState],
  (reports) => reports.submitError
);

// Initialization state
export const selectIsInitialized = createSelector(
  [selectReportsState],
  (reports) => reports.isInitialized
);

// Computed selectors
export const selectPendingReportsCount = createSelector(
  [selectPendingReports],
  (reports) => reports.length
);

export const selectCompletedReportsCount = createSelector(
  [selectCompletedReports],
  (reports) => reports.length
);

export const selectTotalReportsCount = createSelector(
  [selectPendingReportsCount, selectCompletedReportsCount],
  (pending, completed) => pending + completed
);

// Has reports
export const selectHasPendingReports = createSelector(
  [selectPendingReportsCount],
  (count) => count > 0
);

export const selectHasCompletedReports = createSelector(
  [selectCompletedReportsCount],
  (count) => count > 0
);

// Get report by ID
export const selectReportById = (responseId: number) =>
  createSelector(
    [selectPendingReports, selectCompletedReports],
    (pending, completed) => {
      const allReports = [...pending, ...completed];
      return allReports.find((r) => r.responseId === responseId);
    }
  );

