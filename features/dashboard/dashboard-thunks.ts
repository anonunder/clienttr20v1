import { createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardData } from './dashboard-slice';

/**
 * MOCK DATA ONLY - Development Mode
 * 
 * Dashboard is configured to use ONLY mock data.
 * No API calls are made in this implementation.
 */

const USE_MOCK_DATA = true; // Set to false when real API is ready

/**
 * Mock Dashboard Data Generator
 * Returns simulated dashboard data for development/testing
 */
const mockFetchDashboardData = async (): Promise<DashboardData> => {
  // Simulate API delay (500-1500ms random)
  const delay = Math.floor(Math.random() * 1000) + 500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Return mock data
  return {
    stats: {
      activePrograms: 3,
      completedWorkouts: 24,
      totalExercises: 156,
      streak: 7,
    },
    continueWorkout: {
      name: "Upper Body Strength",
      progress: 60,
      lastExercise: "Dumbbell Shoulder Press",
      planId: "1",
      workoutId: "1",
      exerciseId: "2"
    },
    todayExercises: [
      { id: "1", name: "Dumbbell Shoulder Press", sets: 3, reps: 12, completed: true },
      { id: "2", name: "Barbell Squats", sets: 4, reps: 10, completed: false },
      { id: "3", name: "Bench Press", sets: 3, reps: 8, completed: false },
      { id: "4", name: "Deadlifts", sets: 3, reps: 8, completed: false },
      { id: "5", name: "Pull-ups", sets: 3, reps: 10, completed: false },
    ],
    todayMeals: {
      breakfast: { name: "Breakfast", description: "Oatmeal with Berries & Almonds", calories: 350, protein: 12, carbs: 45, fats: 8 },
      lunch: { name: "Lunch", description: "Grilled Chicken Salad with Quinoa", calories: 450, protein: 35, carbs: 30, fats: 15 },
      dinner: { name: "Dinner", description: "Not logged yet", calories: 0, protein: 0, carbs: 0, fats: 0 },
      totalCalories: 800,
      targetCalories: 2100
    },
    todayGoals: [
      { name: "Today's Exercise Time", current: 22, target: 30, unit: "min" },
      { name: "Daily Steps", current: 5832, target: 10000, unit: "steps" },
      { name: "Completed Goals", current: 3, target: 5, unit: "goals" },
      { name: "Water Intake", current: 6, target: 8, unit: "glasses" },
    ],
    measurements: [
      { label: "Weight", value: "75.2", unit: "kg", change: "-0.5", trend: "down" },
      { label: "Body Fat", value: "18.5", unit: "%", change: "-1.2", trend: "down" },
      { label: "Muscle Mass", value: "61.3", unit: "kg", change: "+0.8", trend: "up" },
    ],
    recentReports: [
      { id: "1", name: "Weekly Progress", date: "2025-10-20", type: "Progress" },
      { id: "2", name: "Body Composition", date: "2025-10-15", type: "Measurements" },
      { id: "3", name: "Nutrition Summary", date: "2025-10-12", type: "Nutrition" },
    ],
  };
};

/**
 * Fetch Dashboard Data
 * 
 * Currently configured to use MOCK DATA ONLY
 * 
 * @returns Promise<DashboardData>
 */
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      // FORCE MOCK DATA USAGE
      if (USE_MOCK_DATA) {
        console.log('📊 Dashboard: Loading MOCK data...');
        const data = await mockFetchDashboardData();
        console.log('✅ Dashboard: Mock data loaded successfully');
        return data;
      }

      // Real API integration (currently disabled)
      throw new Error('API integration not implemented. USE_MOCK_DATA must be true.');
      
      // Future API implementation:
      // import { getDashboardData } from '@/api/dashboard/service';
      // const data = await getDashboardData();
      // return data;
      
    } catch (error: any) {
      console.error('❌ Dashboard: Failed to fetch data:', error);
      return rejectWithValue(error.message || 'Failed to fetch dashboard data');
    }
  }
);

