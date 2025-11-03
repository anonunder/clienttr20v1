export interface Exercise {
  id: string;
  name: string;
  videoUrl?: string;
  reps?: number;
  sets?: number;
  duration?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  day: number;
  title: string;
  description?: string;
  exercises: Exercise[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  description?: string;
  weeks: number;
  workouts: Workout[];
}

export interface Recipe {
  id: string;
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients?: string[];
  instructions?: string[];
}

export interface Meal {
  id: string;
  name: string;
  time?: string;
  recipes: Recipe[];
}

export interface NutritionPlan {
  id: string;
  name: string;
  description?: string;
  dailyCalories: number;
  meals: Meal[];
}

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  userName?: string;
  timestamp: string;
}

export interface ProgressSummary {
  userId: string;
  streak: number;
  totalWorkouts: number;
  totalCalories?: number;
  weeklyProgress?: {
    date: string;
    workoutsCompleted: number;
    caloriesConsumed?: number;
  }[];
}

