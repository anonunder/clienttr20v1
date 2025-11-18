import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPendingReports,
  fetchCompletedReports,
  fetchReportDetail,
  submitReportResponse,
} from './reports-thunks';

// Types matching API response
export interface ReportQuestion {
  type: 'text' | 'textarea' | 'number' | 'radio' | 'select' | 'checkbox' | 'stars' | 'date' | 'time' | 'info';
  text: string;
  options: string[];
  required?: boolean;
}

export interface ReportResponse {
  question: string;
  answer: string | string[] | boolean;
}

export interface DetailStatisticField {
  fieldName: string;
  key: string;
  slug: string;
  unit: string;
  type: 'number' | 'text';
  order: number;
  category: string;
  description?: string;
  enabled: boolean;
  hasGoal: boolean;
}

export interface ReportImage {
  id: number;
  fileName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface Report {
  responseId: number;
  reportId: number;
  title: string;
  description: string;
  questions: ReportQuestion[];
  responses?: ReportResponse[];
  measurements?: Record<string, string>; // Submitted measurement data
  submittedAt?: string | null;
  sentDate: string;
  status: 'pending' | 'completed' | 'draft' | 'submitted';
  clientId: string;
  detailsStatistic: boolean;
  detailStatisticsFields?: DetailStatisticField[];
  uploadImage: boolean | number; // Can be boolean or 1/0
  images?: ReportImage[];
  trainerName: string;
  trainerEmail: string;
}

export interface ReportsPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// State interface
export interface ReportsState {
  // Reports data
  pendingReports: Report[];
  completedReports: Report[];
  selectedReport: Report | null;
  
  // Pagination
  completedPagination: ReportsPagination | null;
  
  // Loading states
  loadingPending: boolean;
  loadingCompleted: boolean;
  loadingDetail: boolean;
  submitting: boolean;
  
  // Error states
  error: string | null;
  submitError: string | null;
  
  // Initialization tracking
  isInitialized: boolean;
  lastFetchTimestamp: number | null;
}

const initialState: ReportsState = {
  pendingReports: [],
  completedReports: [],
  selectedReport: null,
  completedPagination: null,
  loadingPending: false,
  loadingCompleted: false,
  loadingDetail: false,
  submitting: false,
  error: null,
  submitError: null,
  isInitialized: false,
  lastFetchTimestamp: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
    clearSubmitError: (state) => {
      state.submitError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetReportsState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Pending Reports
    builder
      .addCase(fetchPendingReports.pending, (state) => {
        state.loadingPending = true;
        state.error = null;
      })
      .addCase(fetchPendingReports.fulfilled, (state, action) => {
        state.loadingPending = false;
        state.pendingReports = action.payload;
        state.isInitialized = true;
        state.lastFetchTimestamp = Date.now();
      })
      .addCase(fetchPendingReports.rejected, (state, action) => {
        state.loadingPending = false;
        state.error = action.payload as string;
      });

    // Fetch Completed Reports
    builder
      .addCase(fetchCompletedReports.pending, (state) => {
        state.loadingCompleted = true;
        state.error = null;
      })
      .addCase(fetchCompletedReports.fulfilled, (state, action) => {
        state.loadingCompleted = false;
        state.completedReports = action.payload.data;
        state.completedPagination = action.payload.pagination;
      })
      .addCase(fetchCompletedReports.rejected, (state, action) => {
        state.loadingCompleted = false;
        state.error = action.payload as string;
      });

    // Fetch Report Detail
    builder
      .addCase(fetchReportDetail.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchReportDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedReport = action.payload;
      })
      .addCase(fetchReportDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload as string;
      });

    // Submit Report Response
    builder
      .addCase(submitReportResponse.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitReportResponse.fulfilled, (state, action) => {
        state.submitting = false;
        
        // The API returns the full report data with updated status
        const submittedReport = action.payload;
        
        // If status is draft, update the report in pending list
        if (submittedReport.status === 'draft') {
          const reportIndex = state.pendingReports.findIndex(
            (r) => r.responseId === submittedReport.responseId
          );
          
          if (reportIndex !== -1) {
            // Update the pending report with new data
            state.pendingReports[reportIndex] = submittedReport;
          }
          
          // Also update selected report if it's the same one
          if (state.selectedReport?.responseId === submittedReport.responseId) {
            state.selectedReport = submittedReport;
          }
        } else {
          // If status is submitted/completed, move from pending to completed
        const reportIndex = state.pendingReports.findIndex(
          (r) => r.responseId === submittedReport.responseId
        );
        
        if (reportIndex !== -1) {
          // Remove from pending
          state.pendingReports.splice(reportIndex, 1);
          
          // Add to completed with full data from API
          const completedReport: Report = {
            ...submittedReport,
            status: submittedReport.status === 'submitted' ? 'completed' : submittedReport.status,
          };
          
          state.completedReports.unshift(completedReport);
        }
        
        // Clear selected report
        state.selectedReport = null;
        }
      })
      .addCase(submitReportResponse.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as string;
      });
  },
});

export const {
  clearSelectedReport,
  clearSubmitError,
  clearError,
  resetReportsState,
} = reportsSlice.actions;

export default reportsSlice.reducer;

