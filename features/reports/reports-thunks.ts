import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { Report, ReportsPagination, ReportResponse } from './reports-slice';

// API Response structures
interface ReportsApiResponse {
  success: boolean;
  data: Report[];
  count: number;
}

interface CompletedReportsApiResponse {
  success: boolean;
  data: Report[];
  pagination: ReportsPagination;
}

interface ReportDetailApiResponse {
  success: boolean;
  data: Report;
}

interface SubmitReportApiResponse {
  success: boolean;
  message: string;
  data: Report;
}

/**
 * Fetch Pending Reports
 * 
 * Get all reports that need to be filled by the client
 * 
 * @param companyId - Company ID (required)
 * @returns Promise<Report[]>
 */
export const fetchPendingReports = createAsyncThunk(
  'reports/fetchPending',
  async (companyId: number, { rejectWithValue }) => {
    try {
      
      const response = await api<ReportsApiResponse>(
        endpoints.reports.pending(companyId)
      );
      
      if (!response.success) {
        throw new Error('Failed to fetch pending reports');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Reports: Failed to fetch pending reports:', error);
      return rejectWithValue(error.message || 'Failed to fetch pending reports');
    }
  }
);

/**
 * Fetch Completed Reports
 * 
 * Get all reports that have been submitted by the client
 * 
 * @param params - Object with companyId and optional filters
 * @returns Promise<{ data: Report[], pagination: ReportsPagination }>
 */
export const fetchCompletedReports = createAsyncThunk(
  'reports/fetchCompleted',
  async (
    params: {
      companyId: number;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      
      const response = await api<CompletedReportsApiResponse>(
        endpoints.reports.completed(params)
      );
      
      if (!response.success) {
        throw new Error('Failed to fetch completed reports');
      }
      
      return {
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      console.error('❌ Reports: Failed to fetch completed reports:', error);
      return rejectWithValue(error.message || 'Failed to fetch completed reports');
    }
  }
);

/**
 * Fetch Report Detail
 * 
 * Get detailed information about a specific report response
 * 
 * @param params - Object with responseId and companyId
 * @returns Promise<Report>
 */
export const fetchReportDetail = createAsyncThunk(
  'reports/fetchDetail',
  async (
    { responseId, companyId }: { responseId: number; companyId: number },
    { rejectWithValue }
  ) => {
    try {
      
      const response = await api<ReportDetailApiResponse>(
        endpoints.reports.detail(responseId, companyId)
      );
      
      if (!response.success) {
        throw new Error('Failed to fetch report detail');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Reports: Failed to fetch report detail:', error);
      return rejectWithValue(error.message || 'Failed to fetch report detail');
    }
  }
);

/**
 * Submit Report Response
 * 
 * Submit answers for a report questionnaire
 * 
 * @param params - Object with responseId, companyId, responses, measurements, images, and status
 * @returns Promise<SubmitReportApiResponse['data']>
 */
export const submitReportResponse = createAsyncThunk(
  'reports/submit',
  async (
    {
      responseId,
      companyId,
      responses,
      measurements,
      images,
      status,
    }: {
      responseId: number;
      companyId: number;
      responses: ReportResponse[];
      measurements?: Record<string, string>;
      images?: { uri: string; base64?: string; fileName?: string; mimeType?: string }[];
      status?: 'draft' | 'completed';
    },
    { rejectWithValue }
  ) => {
    try {
      
      // Prepare body data
      const body: any = {
        companyId,
        responses,
        status: status || 'completed',
      };

      // Add measurements if provided
      if (measurements && Object.keys(measurements).length > 0) {
        body.measurements = measurements;
      }

      // Add images if provided (convert to base64 if needed)
      if (images && images.length > 0) {
        body.images = images.map((img) => ({
          data: img.base64 || img.uri,
          fileName: img.fileName || `image_${Date.now()}.jpg`,
          mimeType: img.mimeType || 'image/jpeg',
        }));
      }

      const response = await api<SubmitReportApiResponse>(
        endpoints.reports.submit(responseId),
        {
          method: 'POST',
          body,
        }
      );
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to submit report');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Reports: Failed to submit report:', error);
      return rejectWithValue(error.message || 'Failed to submit report');
    }
  }
);

