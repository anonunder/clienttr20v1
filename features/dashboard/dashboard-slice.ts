import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchDashboardData, fetchWeeklyOverview } from './dashboard-thunks';
import { 
  DashboardData, 
  WeeklyOverview,
  ActiveProgram,
  ContinueWorkout,
  TodayWorkout,
  TodayMeal,
  DailyProgress,
  RecentMeasurement,
  PendingReport,
  OverallStats
} from '@/types/dashboard';

/**
 * Dashboard Redux Slice
 * Manages complete dashboard state with real API integration
 */

interface DashboardState {
  // Main dashboard data
  data: DashboardData | null;
  
  // Weekly overview data
  weeklyOverview: WeeklyOverview | null;
  
  // Loading states
  loading: boolean;
  weeklyLoading: boolean;
  
  // Error states
  error: string | null;
  weeklyError: string | null;
  
  // Metadata
  lastUpdated: number | null;
  lastWeeklyUpdate: number | null;
}

const initialState: DashboardState = {
  data: null,
  weeklyOverview: null,
  loading: false,
  weeklyLoading: false,
  error: null,
  weeklyError: null,
  lastUpdated: null,
  lastWeeklyUpdate: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // === Real-time Updates via Socket or Optimistic Updates ===
    
    /**
     * Update workout session progress
     */
    updateWorkoutSessionProgress: (state, action: PayloadAction<{
      sessionId: number;
      exercisesCompleted: number;
      currentExerciseId?: number;
    }>) => {
      if (state.data?.continueWorkout && state.data.continueWorkout.sessionId === action.payload.sessionId) {
        state.data.continueWorkout.exercisesCompleted = action.payload.exercisesCompleted;
        if (action.payload.currentExerciseId !== undefined) {
          state.data.continueWorkout.currentExerciseId = action.payload.currentExerciseId;
        }
      }
    },

    /**
     * Update continue workout when workout is completed
     */
    clearContinueWorkout: (state) => {
      if (state.data) {
        state.data.continueWorkout = null;
        state.data.hasInProgressWorkout = false;
      }
    },

    /**
     * Update continue workout data
     */
    setContinueWorkout: (state, action: PayloadAction<ContinueWorkout | null>) => {
      if (state.data) {
        state.data.continueWorkout = action.payload;
        state.data.hasInProgressWorkout = action.payload !== null;
      }
    },

    /**
     * Update daily progress in real-time
     */
    updateDailyProgress: (state, action: PayloadAction<Partial<DailyProgress>>) => {
      if (state.data?.dailyProgress) {
        state.data.dailyProgress = {
          ...state.data.dailyProgress,
          ...action.payload,
        };
      }
    },

    /**
     * Increment completed workouts
     */
    incrementCompletedWorkouts: (state) => {
      if (state.data) {
        state.data.completedWorkouts += 1;
        state.data.weeklyWorkouts += 1;
        state.data.monthlyWorkouts += 1;
        
        // Recalculate completion rate
        if (state.data.totalWorkouts > 0) {
          state.data.workoutCompletionRate = Math.round(
            (state.data.completedWorkouts / state.data.totalWorkouts) * 100
          );
        }
        
        // Update overall stats
        state.data.overallStats.workoutsCompleted += 1;
        
        // Update daily progress
        state.data.dailyProgress.workoutsCompleted += 1;
      }
    },

    /**
     * Add a new measurement to recent measurements
     */
    addMeasurement: (state, action: PayloadAction<RecentMeasurement>) => {
      if (state.data) {
        // Add to the beginning of the array
        state.data.recentMeasurements.unshift(action.payload);
        
        // Keep only the 3 most recent
        if (state.data.recentMeasurements.length > 3) {
          state.data.recentMeasurements = state.data.recentMeasurements.slice(0, 3);
        }
        
        // Increment count
        state.data.measurementsCount += 1;
        state.data.overallStats.measurementsTaken += 1;
      }
    },

    /**
     * Update pending reports count
     */
    updatePendingReportsCount: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.pendingReportsCount = action.payload;
      }
    },

    /**
     * Mark a report as completed
     */
    markReportCompleted: (state, action: PayloadAction<number>) => {
      if (state.data) {
        // Remove from pending reports
        state.data.recentReports = state.data.recentReports.filter(
          report => report.id !== action.payload
        );
        
        // Decrement pending count
        if (state.data.pendingReportsCount > 0) {
          state.data.pendingReportsCount -= 1;
        }
        
        // Increment completed count
        state.data.overallStats.reportsCompleted += 1;
      }
    },

    /**
     * Update overall stats
     */
    updateOverallStats: (state, action: PayloadAction<Partial<OverallStats>>) => {
      if (state.data?.overallStats) {
        state.data.overallStats = {
          ...state.data.overallStats,
          ...action.payload,
        };
      }
    },

    /**
     * Clear all dashboard data
     */
    clearDashboard: (state) => {
      state.data = null;
      state.weeklyOverview = null;
      state.error = null;
      state.weeklyError = null;
      state.lastUpdated = null;
      state.lastWeeklyUpdate = null;
    },

    /**
     * Set loading state manually
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // === Main Dashboard Data ===
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch dashboard data';
      });

    // === Weekly Overview ===
    builder
      .addCase(fetchWeeklyOverview.pending, (state) => {
        state.weeklyLoading = true;
        state.weeklyError = null;
      })
      .addCase(fetchWeeklyOverview.fulfilled, (state, action) => {
        state.weeklyLoading = false;
        state.weeklyOverview = action.payload;
        state.lastWeeklyUpdate = Date.now();
        state.weeklyError = null;
      })
      .addCase(fetchWeeklyOverview.rejected, (state, action) => {
        state.weeklyLoading = false;
        state.weeklyError = action.payload as string || 'Failed to fetch weekly overview';
      });
  },
});

export const {
  updateWorkoutSessionProgress,
  clearContinueWorkout,
  setContinueWorkout,
  updateDailyProgress,
  incrementCompletedWorkouts,
  addMeasurement,
  updatePendingReportsCount,
  markReportCompleted,
  updateOverallStats,
  clearDashboard,
  setLoading,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

// Re-export types for convenience
export type { 
  DashboardData,
  ActiveProgram,
  ContinueWorkout,
  TodayWorkout,
  TodayMeal,
  DailyProgress,
  RecentMeasurement,
  PendingReport,
  OverallStats,
  WeeklyOverview,
};
