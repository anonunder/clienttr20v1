/**
 * Dashboard API Types
 * Based on the real API response structure
 */

export interface ActiveProgram {
  id: number;
  title: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate: string;
  hasTrainingPlan: boolean;
  hasNutritionPlan: boolean;
  trainingPlanId: string | null;
  nutritionPlanId: string | null;
  durationWeeks: number | null;
  difficultyLevel: string | null;
}

export interface ContinueWorkout {
  sessionId: number;
  workoutId: number;
  workoutTitle: string;
  startedAt: string;
  exercisesCompleted: number;
  exercises: any[];
  currentExerciseId: number | null;
  programId: number;
  trainingPlanId: number;
}

export interface TodayWorkout {
  id: number;
  title: string;
  description: string;
  day: number;
  programId: number;
  programTitle: string;
}

export interface TodayMeal {
  id: number;
  title: string;
  description: string;
  day: number;
  programId: number;
  programTitle: string;
}

export interface DailyProgress {
  date: string;
  workoutsCompleted: number;
  exercisesCompleted: number;
  totalDuration: number;
  caloriesBurned: number;
}

export interface RecentMeasurement {
  id: number;
  date: string;
  measurements: Record<string, number>;
  hasImages: boolean;
}

export interface PendingReport {
  id: number;
  title: string;
  sentDate: string;
  status: 'pending' | 'completed';
  reportId: string;
}

export interface OverallStats {
  programsActive: number;
  workoutsCompleted: number;
  exercisesCompleted: number;
  reportsCompleted: number;
  measurementsTaken: number;
}

export interface DashboardData {
  activePrograms: ActiveProgram[];
  totalPrograms: number;
  
  completedWorkouts: number;
  totalWorkouts: number;
  workoutCompletionRate: number;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  
  totalExercises: number;
  completedExercises: number;
  
  continueWorkout: ContinueWorkout | null;
  hasInProgressWorkout: boolean;
  
  todayWorkouts: TodayWorkout[];
  todayMeals: TodayMeal[];
  
  dailyProgress: DailyProgress;
  
  recentMeasurements: RecentMeasurement[];
  measurementsCount: number;
  
  pendingReportsCount: number;
  recentReports: PendingReport[];
  
  overallStats: OverallStats;
}

// Weekly Overview Types
export interface DailyStat {
  day: string;
  workouts: number;
  exercises: number;
  duration: number;
  completed: number;
}

export interface WeeklyOverview {
  period: 'week';
  startDate: string;
  endDate: string;
  dailyStats: DailyStat[];
  totalWorkouts: number;
  totalCompleted: number;
}

// API Response Types
export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export interface WeeklyOverviewResponse {
  success: boolean;
  data: WeeklyOverview;
}

