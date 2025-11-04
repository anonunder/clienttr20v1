import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { Program } from './programs-slice';

// API Response structure
interface ProgramsApiResponse {
  success: boolean;
  data: Program[];
  count: number;
}

interface ProgramDetailApiResponse {
  success: boolean;
  data: Program;
}

/**
 * Fetch Programs List
 * 
 * @param companyId - Company ID (required)
 * @returns Promise<Program[]>
 */
export const fetchProgramsList = createAsyncThunk(
  'programs/fetchList',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const response = await api<ProgramsApiResponse>(endpoints.programs.list(companyId));
      
      if (!response.success) {
        throw new Error('Failed to fetch programs');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch list:', error);
      return rejectWithValue(error.message || 'Failed to fetch programs');
    }
  }
);

/**
 * Fetch Program Detail
 * 
 * @param params - Object with id and companyId
 * @returns Promise<Program>
 */
export const fetchProgramDetail = createAsyncThunk(
  'programs/fetchDetail',
  async ({ id, companyId }: { id: number; companyId: number }, { rejectWithValue }) => {
    try {
      const response = await api<ProgramDetailApiResponse>(endpoints.programs.detail(id, companyId));
      
      if (!response.success) {
        throw new Error('Failed to fetch program detail');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Programs: Failed to fetch detail:', error);
      return rejectWithValue(error.message || 'Failed to fetch program detail');
    }
  }
);

