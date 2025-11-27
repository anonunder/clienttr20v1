import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import type {
  MeasurementTemplate,
  MeasurementEntry,
  SubmitMeasurementPayload,
  FieldProgress,
} from '@/types/measurements';

// API Response structures
interface TemplatesApiResponse {
  success: boolean;
  data: MeasurementTemplate[];
  count: number;
}

interface SubmitMeasurementApiResponse {
  success: boolean;
  message: string;
  data: MeasurementEntry;
}

interface HistoryApiResponse {
  success: boolean;
  data: MeasurementEntry[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface MeasurementDetailApiResponse {
  success: boolean;
  data: MeasurementEntry;
}

interface FieldProgressApiResponse {
  success: boolean;
  data: FieldProgress;
}

/**
 * Fetch Measurement Templates
 */
export const fetchMeasurementTemplates = createAsyncThunk(
  'measurements/fetchTemplates',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const response = await api<TemplatesApiResponse>(endpoints.measurements.templates(companyId));

      if (!response.success) {
        throw new Error('Failed to fetch measurement templates');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Measurements: Failed to fetch templates:', error);
      return rejectWithValue(error.message || 'Failed to fetch measurement templates');
    }
  }
);

/**
 * Submit New Measurement
 */
export const submitMeasurement = createAsyncThunk(
  'measurements/submit',
  async (payload: SubmitMeasurementPayload, { rejectWithValue }) => {
    try {
      const response = await api<SubmitMeasurementApiResponse>(endpoints.measurements.submit(), {
        method: 'POST',
        body: payload,
      });

      if (!response.success) {
        throw new Error('Failed to submit measurement');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Measurements: Failed to submit:', error);
      return rejectWithValue(error.message || 'Failed to submit measurement');
    }
  }
);

/**
 * Fetch Measurement History
 */
export const fetchMeasurementHistory = createAsyncThunk(
  'measurements/fetchHistory',
  async (
    params: {
      companyId: number;
      templateId?: number;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api<HistoryApiResponse>(endpoints.measurements.history(params));

      if (!response.success) {
        throw new Error('Failed to fetch measurement history');
      }

      return {
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      console.error('❌ Measurements: Failed to fetch history:', error);
      return rejectWithValue(error.message || 'Failed to fetch measurement history');
    }
  }
);

/**
 * Fetch Single Measurement by ID
 */
export const fetchMeasurementById = createAsyncThunk(
  'measurements/fetchById',
  async ({ measurementId, companyId }: { measurementId: number; companyId: number }, { rejectWithValue }) => {
    try {
      const response = await api<MeasurementDetailApiResponse>(
        endpoints.measurements.detail(measurementId, companyId)
      );

      if (!response.success) {
        throw new Error('Failed to fetch measurement');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Measurements: Failed to fetch by ID:', error);
      return rejectWithValue(error.message || 'Failed to fetch measurement');
    }
  }
);

/**
 * Fetch Field Progress
 */
export const fetchFieldProgress = createAsyncThunk(
  'measurements/fetchFieldProgress',
  async (
    {
      fieldName,
      params,
    }: {
      fieldName: string;
      params: {
        companyId: number;
        startDate?: string;
        endDate?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api<FieldProgressApiResponse>(endpoints.measurements.progress(fieldName, params));

      if (!response.success) {
        throw new Error('Failed to fetch field progress');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Measurements: Failed to fetch field progress:', error);
      return rejectWithValue(error.message || 'Failed to fetch field progress');
    }
  }
);

