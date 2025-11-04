import { RootState } from '@/state/store';

// Safe selectors with optional chaining to prevent crashes
export const selectDashboardData = (state: RootState) => state.dashboard?.data || null;
export const selectDashboardLoading = (state: RootState) => state.dashboard?.loading || false;
export const selectDashboardError = (state: RootState) => state.dashboard?.error || null;
export const selectDashboardLastUpdated = (state: RootState) => state.dashboard?.lastUpdated || null;

export const selectTodayExercises = (state: RootState) => state.dashboard?.data?.todayExercises || [];
export const selectTodayMeals = (state: RootState) => state.dashboard?.data?.todayMeals;
export const selectContinueWorkout = (state: RootState) => state.dashboard?.data?.continueWorkout;
export const selectDashboardStats = (state: RootState) => state.dashboard?.data?.stats;
export const selectTodayGoals = (state: RootState) => state.dashboard?.data?.todayGoals || [];
export const selectMeasurements = (state: RootState) => state.dashboard?.data?.measurements || [];
export const selectRecentReports = (state: RootState) => state.dashboard?.data?.recentReports || [];

