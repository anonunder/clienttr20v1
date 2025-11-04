/**
 * Type definitions for Dashboard Socket Events
 */

// Payload types for LISTEN events
export interface ExerciseCompletedPayload {
  exerciseId: string;
  completed: boolean;
  completedAt?: string;
  userId: string;
}

export interface ExerciseStartedPayload {
  exerciseId: string;
  startedAt: string;
  userId: string;
}

export interface WorkoutProgressPayload {
  workoutId: string;
  progress: number;
  completedExercises: number;
  totalExercises: number;
  userId: string;
}

export interface WorkoutCompletedPayload {
  workoutId: string;
  completedAt: string;
  duration: number;
  userId: string;
}

export interface MealLoggedPayload {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  meal: {
    name: string;
    description: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
  };
  loggedAt: string;
  userId: string;
}

export interface MealUpdatedPayload {
  mealId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  updates: Partial<MealLoggedPayload['meal']>;
  userId: string;
}

export interface GoalProgressPayload {
  goalId: string;
  goalName: string;
  current: number;
  target: number;
  unit: string;
  userId: string;
}

export interface GoalCompletedPayload {
  goalId: string;
  goalName: string;
  completedAt: string;
  userId: string;
}

export interface StatsUpdatedPayload {
  stats: {
    activePrograms: number;
    completedWorkouts: number;
    totalExercises: number;
    streak: number;
  };
  userId: string;
}

export interface MeasurementAddedPayload {
  measurement: {
    id: string;
    label: string;
    value: string;
    unit: string;
    change?: string;
    trend?: 'up' | 'down';
  };
  userId: string;
}

export interface ReportGeneratedPayload {
  report: {
    id: string;
    name: string;
    date: string;
    type: string;
  };
  userId: string;
}

export interface DataRefreshPayload {
  sections: Array<'stats' | 'exercises' | 'meals' | 'goals' | 'measurements' | 'reports'>;
  userId: string;
}

// Payload types for EMIT events
export interface JoinDashboardPayload {
  userId: string;
  timestamp: string;
}

export interface MarkExerciseCompletePayload {
  exerciseId: string;
  completed: boolean;
  workoutId?: string;
}

export interface MarkGoalCompletePayload {
  goalId: string;
}

export interface SyncDataPayload {
  sections?: Array<'stats' | 'exercises' | 'meals' | 'goals' | 'measurements' | 'reports'>;
  lastSyncedAt?: string;
}

// Callback types for Socket Event Handlers
export type SocketEventCallback<T = any> = (payload: T) => void;

// Socket Emit Queue Item (for dynamic storage)
export interface SocketEmitQueueItem {
  event: string;
  payload: any;
  timestamp: number;
  id: string;
  retries: number;
  maxRetries: number;
}

