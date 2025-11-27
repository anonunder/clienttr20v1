import { RootState } from '@/state/store';
import { createSelector } from '@reduxjs/toolkit';

/**
 * Dashboard Selectors
 * Provides memoized access to dashboard state
 */

// === Base Selectors ===

export const selectDashboard = (state: RootState) => state.dashboard;

export const selectDashboardData = (state: RootState) => state.dashboard.data;

export const selectWeeklyOverview = (state: RootState) => state.dashboard.weeklyOverview;

export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;

export const selectWeeklyLoading = (state: RootState) => state.dashboard.weeklyLoading;

export const selectDashboardError = (state: RootState) => state.dashboard.error;

export const selectWeeklyError = (state: RootState) => state.dashboard.weeklyError;

export const selectLastUpdated = (state: RootState) => state.dashboard.lastUpdated;

export const selectLastWeeklyUpdate = (state: RootState) => state.dashboard.lastWeeklyUpdate;

// === Derived Selectors (Memoized) ===

/**
 * Select active programs
 */
export const selectActivePrograms = createSelector(
  [selectDashboardData],
  (data) => data?.activePrograms || []
);

/**
 * Select continue workout session
 */
export const selectContinueWorkout = createSelector(
  [selectDashboardData],
  (data) => data?.continueWorkout || null
);

/**
 * Check if there's a workout in progress
 */
export const selectHasInProgressWorkout = createSelector(
  [selectDashboardData],
  (data) => data?.hasInProgressWorkout || false
);

/**
 * Select today's workouts
 */
export const selectTodayWorkouts = createSelector(
  [selectDashboardData],
  (data) => data?.todayWorkouts || []
);

/**
 * Select today's meals
 */
export const selectTodayMeals = createSelector(
  [selectDashboardData],
  (data) => data?.todayMeals || []
);

/**
 * Select daily progress
 */
export const selectDailyProgress = createSelector(
  [selectDashboardData],
  (data) => data?.dailyProgress || null
);

/**
 * Select recent measurements
 */
export const selectRecentMeasurements = createSelector(
  [selectDashboardData],
  (data) => data?.recentMeasurements || []
);

/**
 * Select pending reports count
 */
export const selectPendingReportsCount = createSelector(
  [selectDashboardData],
  (data) => data?.pendingReportsCount || 0
);

/**
 * Select recent reports
 */
export const selectRecentReports = createSelector(
  [selectDashboardData],
  (data) => data?.recentReports || []
);

/**
 * Select overall statistics
 */
export const selectOverallStats = createSelector(
  [selectDashboardData],
  (data) => data?.overallStats || null
);

/**
 * Select workout statistics
 */
export const selectWorkoutStats = createSelector(
  [selectDashboardData],
  (data) => {
    if (!data) return null;
    
    return {
      completedWorkouts: data.completedWorkouts,
      totalWorkouts: data.totalWorkouts,
      completionRate: data.workoutCompletionRate,
      weeklyWorkouts: data.weeklyWorkouts,
      monthlyWorkouts: data.monthlyWorkouts,
      totalExercises: data.totalExercises,
      completedExercises: data.completedExercises,
    };
  }
);

/**
 * Select program statistics
 */
export const selectProgramStats = createSelector(
  [selectDashboardData],
  (data) => {
    if (!data) return null;
    
    return {
      totalPrograms: data.totalPrograms,
      activePrograms: data.activePrograms.length,
      programsWithTraining: data.activePrograms.filter(p => p.hasTrainingPlan).length,
      programsWithNutrition: data.activePrograms.filter(p => p.hasNutritionPlan).length,
    };
  }
);

/**
 * Check if dashboard data is stale (older than 5 minutes)
 */
export const selectIsDashboardStale = createSelector(
  [selectLastUpdated],
  (lastUpdated) => {
    if (!lastUpdated) return true;
    const fiveMinutesInMs = 5 * 60 * 1000;
    return Date.now() - lastUpdated > fiveMinutesInMs;
  }
);

/**
 * Check if weekly data is stale (older than 10 minutes)
 */
export const selectIsWeeklyStale = createSelector(
  [selectLastWeeklyUpdate],
  (lastWeeklyUpdate) => {
    if (!lastWeeklyUpdate) return true;
    const tenMinutesInMs = 10 * 60 * 1000;
    return Date.now() - lastWeeklyUpdate > tenMinutesInMs;
  }
);

/**
 * Select dashboard loading state (any loading)
 */
export const selectIsAnyLoading = createSelector(
  [selectDashboardLoading, selectWeeklyLoading],
  (dashboardLoading, weeklyLoading) => dashboardLoading || weeklyLoading
);

/**
 * Select if dashboard has any errors
 */
export const selectHasErrors = createSelector(
  [selectDashboardError, selectWeeklyError],
  (dashboardError, weeklyError) => !!(dashboardError || weeklyError)
);

/**
 * Select all errors combined
 */
export const selectAllErrors = createSelector(
  [selectDashboardError, selectWeeklyError],
  (dashboardError, weeklyError) => {
    const errors = [];
    if (dashboardError) errors.push(dashboardError);
    if (weeklyError) errors.push(weeklyError);
    return errors;
  }
);

/**
 * Select if dashboard is ready (has data and not loading)
 */
export const selectIsDashboardReady = createSelector(
  [selectDashboardData, selectDashboardLoading],
  (data, loading) => !!data && !loading
);

/**
 * Select measurements count
 */
export const selectMeasurementsCount = createSelector(
  [selectDashboardData],
  (data) => data?.measurementsCount || 0
);

/**
 * Select today's schedule (workouts + meals combined)
 */
export const selectTodaySchedule = createSelector(
  [selectTodayWorkouts, selectTodayMeals],
  (workouts, meals) => {
    return {
      workouts,
      meals,
      hasWorkouts: workouts.length > 0,
      hasMeals: meals.length > 0,
      totalItems: workouts.length + meals.length,
    };
  }
);

/**
 * Select daily progress percentage
 */
export const selectDailyProgressPercentage = createSelector(
  [selectDailyProgress],
  (progress) => {
    if (!progress) return 0;
    
    // Calculate based on workouts completed vs expected
    // Assuming at least 1 workout per day is the goal
    const workoutGoal = 1;
    const percentage = Math.min((progress.workoutsCompleted / workoutGoal) * 100, 100);
    
    return Math.round(percentage);
  }
);

/**
 * Select calorie progress percentage
 */
export const selectCalorieProgressPercentage = createSelector(
  [selectDailyProgress],
  (progress) => {
    if (!progress || progress.caloriesBurned === 0) return 0;
    
    // Assuming 500 calories burned is the daily goal
    const calorieGoal = 500;
    const percentage = Math.min((progress.caloriesBurned / calorieGoal) * 100, 100);
    
    return Math.round(percentage);
  }
);

/**
 * Select if user has any active programs
 */
export const selectHasActivePrograms = createSelector(
  [selectActivePrograms],
  (programs) => programs.length > 0
);

/**
 * Select first active program (primary program)
 */
export const selectPrimaryProgram = createSelector(
  [selectActivePrograms],
  (programs) => programs[0] || null
);

/**
 * Get most recent measurement value for a specific field
 */
export const selectLatestMeasurementValue = (fieldName: string) =>
  createSelector(
    [selectRecentMeasurements],
    (measurements) => {
      if (measurements.length === 0) return null;
      
      const latestMeasurement = measurements[0];
      const value = latestMeasurement.measurements[fieldName];
      
      return value !== undefined ? value : null;
    }
  );

/**
 * Select weekly daily stats
 */
export const selectWeeklyDailyStats = createSelector(
  [selectWeeklyOverview],
  (weeklyOverview) => weeklyOverview?.dailyStats || []
);

/**
 * Select weekly total workouts
 */
export const selectWeeklyTotalWorkouts = createSelector(
  [selectWeeklyOverview],
  (weeklyOverview) => weeklyOverview?.totalWorkouts || 0
);

/**
 * Select weekly completion rate
 */
export const selectWeeklyCompletionRate = createSelector(
  [selectWeeklyOverview],
  (weeklyOverview) => {
    if (!weeklyOverview || weeklyOverview.totalWorkouts === 0) return 0;
    return Math.round((weeklyOverview.totalCompleted / weeklyOverview.totalWorkouts) * 100);
  }
);
