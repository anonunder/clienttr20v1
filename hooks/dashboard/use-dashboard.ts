import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { AppDispatch } from '@/state/store';
import {
  fetchDashboardData,
  fetchWeeklyOverview,
  refreshDashboard,
  clearDashboard,
  incrementCompletedWorkouts,
  addMeasurement,
  markReportCompleted,
  updateDailyProgress,
  setContinueWorkout,
  clearContinueWorkout,
  updateWorkoutSessionProgress,
  selectDashboardData,
  selectWeeklyOverview,
  selectDashboardLoading,
  selectWeeklyLoading,
  selectDashboardError,
  selectWeeklyError,
  selectActivePrograms,
  selectContinueWorkout,
  selectHasInProgressWorkout,
  selectTodayWorkouts,
  selectTodayMeals,
  selectDailyProgress,
  selectRecentMeasurements,
  selectPendingReportsCount,
  selectRecentReports,
  selectOverallStats,
  selectWorkoutStats,
  selectProgramStats,
  selectIsDashboardStale,
  selectIsDashboardReady,
  selectTodaySchedule,
  selectDailyProgressPercentage,
  selectHasActivePrograms,
  selectPrimaryProgram,
  selectMeasurementsCount,
  selectWeeklyDailyStats,
  selectWeeklyCompletionRate,
} from '@/features/dashboard';
import { RootState } from '@/state/store';

/**
 * Custom Hook: useDashboard
 * 
 * Provides easy access to all dashboard functionality and data.
 * Handles fetching, refreshing, and updating dashboard state.
 * 
 * @example
 * ```tsx
 * const {
 *   data,
 *   loading,
 *   error,
 *   activePrograms,
 *   continueWorkout,
 *   todayWorkouts,
 *   refresh,
 * } = useDashboard();
 * 
 * // Fetch data on mount
 * useEffect(() => {
 *   fetchData();
 * }, []);
 * 
 * // Refresh on pull-to-refresh
 * const onRefresh = async () => {
 *   await refresh();
 * };
 * ```
 */
export function useDashboard() {
  const dispatch = useDispatch<AppDispatch>();

  // === Data Selectors ===
  const data = useSelector(selectDashboardData);
  const weeklyOverview = useSelector(selectWeeklyOverview);
  
  // === Loading & Error States ===
  const loading = useSelector(selectDashboardLoading);
  const weeklyLoading = useSelector(selectWeeklyLoading);
  const error = useSelector(selectDashboardError);
  const weeklyError = useSelector(selectWeeklyError);
  
  // === Derived Data ===
  const activePrograms = useSelector(selectActivePrograms);
  const continueWorkout = useSelector(selectContinueWorkout);
  const hasInProgressWorkout = useSelector(selectHasInProgressWorkout);
  const todayWorkouts = useSelector(selectTodayWorkouts);
  const todayMeals = useSelector(selectTodayMeals);
  const dailyProgress = useSelector(selectDailyProgress);
  const recentMeasurements = useSelector(selectRecentMeasurements);
  const pendingReportsCount = useSelector(selectPendingReportsCount);
  const recentReports = useSelector(selectRecentReports);
  const overallStats = useSelector(selectOverallStats);
  const workoutStats = useSelector(selectWorkoutStats);
  const programStats = useSelector(selectProgramStats);
  const todaySchedule = useSelector(selectTodaySchedule);
  const dailyProgressPercentage = useSelector(selectDailyProgressPercentage);
  const hasActivePrograms = useSelector(selectHasActivePrograms);
  const primaryProgram = useSelector(selectPrimaryProgram);
  const measurementsCount = useSelector(selectMeasurementsCount);
  const weeklyDailyStats = useSelector(selectWeeklyDailyStats);
  const weeklyCompletionRate = useSelector(selectWeeklyCompletionRate);
  
  // === Status Checks ===
  const isStale = useSelector(selectIsDashboardStale);
  const isReady = useSelector(selectIsDashboardReady);

  // === Actions ===
  
  /**
   * Fetch dashboard data from API
   */
  const fetchData = useCallback(async () => {
    const result = await dispatch(fetchDashboardData());
    return result;
  }, [dispatch]);

  /**
   * Fetch weekly overview
   */
  const fetchWeekly = useCallback(async () => {
    const result = await dispatch(fetchWeeklyOverview());
    return result;
  }, [dispatch]);

  /**
   * Refresh all dashboard data
   */
  const refresh = useCallback(async () => {
    const result = await dispatch(refreshDashboard());
    return result;
  }, [dispatch]);

  /**
   * Clear dashboard data
   */
  const clear = useCallback(() => {
    dispatch(clearDashboard());
  }, [dispatch]);

  /**
   * Increment completed workouts count
   */
  const onWorkoutCompleted = useCallback(() => {
    dispatch(incrementCompletedWorkouts());
  }, [dispatch]);

  /**
   * Add new measurement
   */
  const onMeasurementAdded = useCallback((measurement: any) => {
    dispatch(addMeasurement(measurement));
  }, [dispatch]);

  /**
   * Mark report as completed
   */
  const onReportCompleted = useCallback((reportId: number) => {
    dispatch(markReportCompleted(reportId));
  }, [dispatch]);

  /**
   * Update daily progress
   */
  const updateProgress = useCallback((progress: any) => {
    dispatch(updateDailyProgress(progress));
  }, [dispatch]);

  /**
   * Set continue workout session
   */
  const setWorkoutSession = useCallback((workout: any) => {
    dispatch(setContinueWorkout(workout));
  }, [dispatch]);

  /**
   * Clear continue workout
   */
  const clearWorkoutSession = useCallback(() => {
    dispatch(clearContinueWorkout());
  }, [dispatch]);

  /**
   * Update workout session progress
   */
  const updateSessionProgress = useCallback((sessionData: any) => {
    dispatch(updateWorkoutSessionProgress(sessionData));
  }, [dispatch]);

  return {
    // === Data ===
    data,
    weeklyOverview,
    activePrograms,
    continueWorkout,
    hasInProgressWorkout,
    todayWorkouts,
    todayMeals,
    dailyProgress,
    recentMeasurements,
    pendingReportsCount,
    recentReports,
    overallStats,
    workoutStats,
    programStats,
    todaySchedule,
    dailyProgressPercentage,
    hasActivePrograms,
    primaryProgram,
    measurementsCount,
    weeklyDailyStats,
    weeklyCompletionRate,

    // === Status ===
    loading,
    weeklyLoading,
    error,
    weeklyError,
    isStale,
    isReady,

    // === Actions ===
    fetchData,
    fetchWeekly,
    refresh,
    clear,
    onWorkoutCompleted,
    onMeasurementAdded,
    onReportCompleted,
    updateProgress,
    setWorkoutSession,
    clearWorkoutSession,
    updateSessionProgress,
  };
}

/**
 * Hook to auto-fetch dashboard data on mount
 * 
 * @param autoFetch - Whether to fetch data automatically on mount (default: true)
 * @param autoRefresh - Whether to refresh stale data automatically (default: false)
 * 
 * @example
 * ```tsx
 * const dashboard = useDashboardAutoFetch();
 * 
 * if (dashboard.loading) return <Loading />;
 * if (dashboard.error) return <Error message={dashboard.error} />;
 * 
 * return <DashboardContent data={dashboard.data} />;
 * ```
 */
export function useDashboardAutoFetch(autoFetch = true, autoRefresh = false) {
  const dashboard = useDashboard();

  useEffect(() => {
    if (autoFetch && !dashboard.data && !dashboard.loading) {
      dashboard.fetchData();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (autoRefresh && dashboard.isStale && !dashboard.loading) {
      dashboard.refresh();
    }
  }, [autoRefresh, dashboard.isStale]);

  return dashboard;
}

