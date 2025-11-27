import { createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardData, WeeklyOverview } from '@/types/dashboard';
import { getDashboardData, getWeeklyOverview } from './dashboard-service';
import { RootState } from '@/state/store';

/**
 * Dashboard Async Thunks
 * Handles async operations for dashboard data fetching
 */

/**
 * Fetch complete dashboard data from the API
 * 
 * Requires:
 * - User must be authenticated
 * - Company must be selected
 * 
 * @returns Promise<DashboardData>
 */
export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  void,
  { state: RootState; rejectValue: string }
>(
  'dashboard/fetchData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { selectedCompanyId, isAuthenticated } = state.auth;

      // Validation checks
      if (!isAuthenticated) {
        console.error('❌ Dashboard: User not authenticated');
        return rejectWithValue('User not authenticated');
      }

      if (!selectedCompanyId) {
        console.error('❌ Dashboard: No company selected');
        return rejectWithValue('No company selected');
      }

      console.log('📊 Dashboard: Fetching data for company:', selectedCompanyId);

      // Call the API
      const response = await getDashboardData(Number(selectedCompanyId));

      if (!response.success || !response.data) {
        console.error('❌ Dashboard: Invalid API response');
        return rejectWithValue('Invalid response from server');
      }

      console.log('✅ Dashboard: Data fetched successfully');
      console.log('  - Active programs:', response.data.totalPrograms);
      console.log('  - Completed workouts:', response.data.completedWorkouts);
      console.log('  - Has in-progress workout:', response.data.hasInProgressWorkout);
      console.log('  - Today\'s workouts:', response.data.todayWorkouts.length);
      console.log('  - Today\'s meals:', response.data.todayMeals.length);
      console.log('  - Recent measurements:', response.data.recentMeasurements.length);
      console.log('  - Pending reports:', response.data.pendingReportsCount);

      return response.data;
    } catch (error: any) {
      console.error('❌ Dashboard: Failed to fetch data:', error);
      
      // Handle specific error cases
      if (error?.message?.includes('jwt expired')) {
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (error?.message?.includes('403')) {
        return rejectWithValue('Access denied to this company');
      }
      
      if (error?.message?.includes('404')) {
        return rejectWithValue('Dashboard data not found');
      }

      return rejectWithValue(
        error?.message || 'Failed to fetch dashboard data. Please try again.'
      );
    }
  }
);

/**
 * Fetch weekly overview with daily breakdown
 * 
 * Requires:
 * - User must be authenticated
 * - Company must be selected
 * 
 * @returns Promise<WeeklyOverview>
 */
export const fetchWeeklyOverview = createAsyncThunk<
  WeeklyOverview,
  void,
  { state: RootState; rejectValue: string }
>(
  'dashboard/fetchWeekly',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { selectedCompanyId, isAuthenticated } = state.auth;

      // Validation checks
      if (!isAuthenticated) {
        console.error('❌ Dashboard: User not authenticated');
        return rejectWithValue('User not authenticated');
      }

      if (!selectedCompanyId) {
        console.error('❌ Dashboard: No company selected');
        return rejectWithValue('No company selected');
      }

      console.log('📊 Dashboard: Fetching weekly overview for company:', selectedCompanyId);

      // Call the API
      const response = await getWeeklyOverview(Number(selectedCompanyId));

      if (!response.success || !response.data) {
        console.error('❌ Dashboard: Invalid weekly overview response');
        return rejectWithValue('Invalid response from server');
      }

      console.log('✅ Dashboard: Weekly overview fetched successfully');
      console.log('  - Period:', response.data.period);
      console.log('  - Start date:', response.data.startDate);
      console.log('  - End date:', response.data.endDate);
      console.log('  - Total workouts:', response.data.totalWorkouts);
      console.log('  - Total completed:', response.data.totalCompleted);

      return response.data;
    } catch (error: any) {
      console.error('❌ Dashboard: Failed to fetch weekly overview:', error);
      
      // Handle specific error cases
      if (error?.message?.includes('jwt expired')) {
        return rejectWithValue('Session expired. Please login again.');
      }
      
      if (error?.message?.includes('403')) {
        return rejectWithValue('Access denied to this company');
      }

      return rejectWithValue(
        error?.message || 'Failed to fetch weekly overview. Please try again.'
      );
    }
  }
);

/**
 * Refresh dashboard data
 * Convenience thunk that fetches both main dashboard and weekly overview
 * 
 * @returns Promise<void>
 */
export const refreshDashboard = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  'dashboard/refresh',
  async (_, { dispatch }) => {
    console.log('🔄 Dashboard: Refreshing all data...');
    
    // Fetch both main dashboard and weekly overview in parallel
    await Promise.all([
      dispatch(fetchDashboardData()),
      dispatch(fetchWeeklyOverview()),
    ]);
    
    console.log('✅ Dashboard: Refresh complete');
  }
);
