import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import uiReducer from './slices/ui-slice';
import dashboardReducer from '@/features/dashboard/dashboard-slice';
import programsReducer from '@/features/programs/programs-slice';
import exerciseReducer from '@/features/exercise/exercise-slice';
import workoutSessionReducer from '@/features/workout-session/workout-session-slice';
import nutritionReducer from '@/features/nutrition/nutrition-slice';
import reportsReducer from '@/features/reports/reports-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    programs: programsReducer,
    exercise: exerciseReducer,
    workoutSession: workoutSessionReducer,
    nutrition: nutritionReducer,
    reports: reportsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore socket-related actions
        ignoredActions: ['socket/connect', 'socket/disconnect'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

