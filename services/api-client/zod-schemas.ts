import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  videoUrl: z.string().optional(),
  reps: z.number().optional(),
  sets: z.number().optional(),
  duration: z.number().optional(),
  notes: z.string().optional(),
});

export const WorkoutSchema = z.object({
  id: z.string(),
  day: z.number(),
  title: z.string(),
  description: z.string().optional(),
  exercises: z.array(ExerciseSchema),
});

export const TrainingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  weeks: z.number(),
  workouts: z.array(WorkoutSchema),
});

export const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  ingredients: z.array(z.string()).optional(),
  instructions: z.array(z.string()).optional(),
});

export const MealSchema = z.object({
  id: z.string(),
  name: z.string(),
  time: z.string().optional(),
  recipes: z.array(RecipeSchema),
});

export const NutritionPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  dailyCalories: z.number(),
  meals: z.array(MealSchema),
});

export const ChatMessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  userId: z.string(),
  userName: z.string().optional(),
  timestamp: z.string(),
});

export const ProgressSummarySchema = z.object({
  userId: z.string(),
  streak: z.number(),
  totalWorkouts: z.number(),
  totalCalories: z.number().optional(),
  weeklyProgress: z
    .array(
      z.object({
        date: z.string(),
        workoutsCompleted: z.number(),
        caloriesConsumed: z.number().optional(),
      }),
    )
    .optional(),
});

export type User = z.infer<typeof UserSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type Workout = z.infer<typeof WorkoutSchema>;
export type TrainingPlan = z.infer<typeof TrainingPlanSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;
export type Meal = z.infer<typeof MealSchema>;
export type NutritionPlan = z.infer<typeof NutritionPlanSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ProgressSummary = z.infer<typeof ProgressSummarySchema>;

