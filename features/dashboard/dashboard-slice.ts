import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchDashboardData } from './dashboard-thunks';

// Types
export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fats?: number;
}

export interface TodayMeals {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  totalCalories: number;
  targetCalories: number;
}

export interface ContinueWorkout {
  name: string;
  progress: number;
  lastExercise: string;
  planId: string;
  workoutId: string;
  exerciseId: string;
}

export interface Stats {
  activePrograms: number;
  completedWorkouts: number;
  totalExercises: number;
  streak: number;
}

export interface Goal {
  name: string;
  current: number;
  target: number;
  unit: string;
}

export interface Measurement {
  label: string;
  value: string;
  unit: string;
  change?: string;
  trend?: 'up' | 'down';
}

export interface Report {
  id: string;
  name: string;
  date: string;
  type: string;
}

export interface DashboardData {
  stats: Stats;
  continueWorkout?: ContinueWorkout | null;
  todayExercises: Exercise[];
  todayMeals: TodayMeals;
  todayGoals: Goal[];
  measurements: Measurement[];
  recentReports: Report[];
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Real-time socket updates
    updateExerciseCompletion: (state, action: PayloadAction<{ exerciseId: string; completed: boolean }>) => {
      if (state.data?.todayExercises) {
        const exercise = state.data.todayExercises.find(ex => ex.id === action.payload.exerciseId);
        if (exercise) {
          exercise.completed = action.payload.completed;
        }
      }
    },
    updateWorkoutProgress: (state, action: PayloadAction<{ workoutId: string; progress: number }>) => {
      if (state.data?.continueWorkout && state.data.continueWorkout.workoutId === action.payload.workoutId) {
        state.data.continueWorkout.progress = action.payload.progress;
      }
    },
    updateMealLog: (state, action: PayloadAction<{ mealType: 'breakfast' | 'lunch' | 'dinner'; data: Partial<Meal> }>) => {
      if (state.data?.todayMeals) {
        const currentMeal = state.data.todayMeals[action.payload.mealType];
        state.data.todayMeals[action.payload.mealType] = {
          ...currentMeal,
          ...action.payload.data,
        };
        // Recalculate total
        state.data.todayMeals.totalCalories = 
          state.data.todayMeals.breakfast.calories +
          state.data.todayMeals.lunch.calories +
          state.data.todayMeals.dinner.calories;
      }
    },
    updateGoalProgress: (state, action: PayloadAction<{ goalId: string; goalName: string; current: number }>) => {
      if (state.data?.todayGoals) {
        const goal = state.data.todayGoals.find(g => g.name === action.payload.goalName);
        if (goal) {
          goal.current = action.payload.current;
        }
      }
    },
    updateStats: (state, action: PayloadAction<Stats>) => {
      if (state.data) {
        state.data.stats = action.payload;
      }
    },
    addMeasurement: (state, action: PayloadAction<Measurement>) => {
      if (state.data) {
        // Check if measurement already exists, update or add
        const existingIndex = state.data.measurements.findIndex(m => m.label === action.payload.label);
        if (existingIndex >= 0) {
          state.data.measurements[existingIndex] = action.payload;
        } else {
          state.data.measurements.push(action.payload);
        }
      }
    },
    addReport: (state, action: PayloadAction<Report>) => {
      if (state.data) {
        // Add to beginning of reports array
        state.data.recentReports.unshift(action.payload);
        // Keep only last 5 reports
        if (state.data.recentReports.length > 5) {
          state.data.recentReports = state.data.recentReports.slice(0, 5);
        }
      }
    },
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  updateExerciseCompletion,
  updateWorkoutProgress,
  updateMealLog,
  updateGoalProgress,
  updateStats,
  addMeasurement,
  addReport,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

