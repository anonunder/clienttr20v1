import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/state/store';
import { fetchDashboardData } from '@/features/dashboard/dashboard-thunks';
import {
  selectDashboardData,
  selectDashboardLoading,
  selectDashboardError,
  selectTodayExercises,
  selectTodayMeals,
  selectContinueWorkout,
  selectDashboardStats,
  selectTodayGoals,
  selectMeasurements,
  selectRecentReports,
} from '@/features/dashboard/dashboard-selectors';
import { useDashboardSocket } from './use-dashboard-socket';

/**
 * ⚠️ MOCK DATA ONLY - Development Mode
 * 
 * This hook uses ONLY mock data for the dashboard.
 * No real API calls are made. See dashboard-thunks.ts for configuration.
 */

/**
 * Default/Fallback values for dashboard data
 */
const DEFAULT_STATS = {
  activePrograms: 0,
  completedWorkouts: 0,
  totalExercises: 0,
  streak: 0,
};

const DEFAULT_MEALS = {
  breakfast: { name: 'Breakfast', description: 'Not logged yet', calories: 0 },
  lunch: { name: 'Lunch', description: 'Not logged yet', calories: 0 },
  dinner: { name: 'Dinner', description: 'Not logged yet', calories: 0 },
  totalCalories: 0,
  targetCalories: 2100,
};

/**
 * Hook for Dashboard Data Management
 * Combines API fetching with socket real-time updates
 * Provides fallback values when data is missing
 */
export const useDashboardData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Redux selectors
  const data = useSelector(selectDashboardData);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);
  const todayExercises = useSelector(selectTodayExercises);
  const todayMeals = useSelector(selectTodayMeals);
  const continueWorkout = useSelector(selectContinueWorkout);
  const stats = useSelector(selectDashboardStats);
  const todayGoals = useSelector(selectTodayGoals);
  const measurements = useSelector(selectMeasurements);
  const recentReports = useSelector(selectRecentReports);

  // Socket connection
  const socket = useDashboardSocket();

  // Initialize dashboard - clean async function, no Redux leaking
  const initializeDashboard = useCallback(async (): Promise<void> => {
    if (isInitializing || loading) {
      console.log('⏭️ Skipping initialization - already in progress');
      return; // Prevent duplicate calls
    }
    
    setIsInitializing(true);
    try {
      await dispatch(fetchDashboardData()).unwrap();
      console.log('✅ Dashboard initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize dashboard:', error);
      throw error; // Re-throw if component wants to handle
    } finally {
      setIsInitializing(false);
    }
  }, [dispatch, isInitializing, loading]);

  // Refresh function for pull-to-refresh - clean async function
  const refresh = useCallback(async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      await dispatch(fetchDashboardData()).unwrap();
      console.log('✅ Dashboard refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh dashboard:', error);
      throw error; // Re-throw if component wants to handle
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  // Sync via socket
  const syncViaSocket = useCallback(() => {
    socket.syncData();
  }, [socket]);

  // Request specific sections via socket
  const requestSection = useCallback((section: 'stats' | 'exercises' | 'meals' | 'goals') => {
    switch (section) {
      case 'stats':
        socket.requestStats();
        break;
      case 'exercises':
        socket.requestExercises();
        break;
      case 'meals':
        socket.requestMeals();
        break;
      case 'goals':
        socket.requestGoals();
        break;
    }
  }, [socket]);

  return {
    // Full data
    data,

    // Granular selectors with fallbacks
    todayExercises: todayExercises || [],
    todayMeals: todayMeals || DEFAULT_MEALS,
    continueWorkout: continueWorkout || null,
    stats: stats || DEFAULT_STATS,
    todayGoals: todayGoals || [],
    measurements: measurements || [],
    recentReports: recentReports || [],

    // Loading states
    loading,
    isRefreshing,
    isInitializing, // Track initialization separately
    error,

    // Socket status
    socketConnected: socket.isConnected,
    socketReady: socket.isReady,
    socketListenersActive: socket.listenersRegistered,

    // Actions - clean async functions, no Redux internals leaked
    initializeDashboard, // async () => Promise<void>
    refresh,             // async () => Promise<void>
    syncViaSocket,       // Request via socket
    requestSection,      // Request specific section

    // Socket actions
    markExerciseComplete: socket.markExerciseComplete,
    markGoalComplete: socket.markGoalComplete,
  };
};

