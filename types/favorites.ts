export type FavoriteEntityType = 
  | 'exercise' 
  | 'recipe' 
  | 'food' 
  | 'workout' 
  | 'training_plan_workout' 
  | 'meal' 
  | 'nutrition_plan_meal' 
  | 'program' 
  | 'program_assigned' 
  | 'training_plan' 
  | 'training_plan_assigned' 
  | 'nutrition_plan' 
  | 'nutrition_plan_assigned';

export interface FavoriteItem {
  id: string;
  title: string;
  type: 'training' | 'nutrition';
  description: string;
  duration?: string;
  calories?: number;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  rating?: number;
  entityType: FavoriteEntityType;
  entityId: number;
  isFavorited?: boolean;
  thumbnailUrl?: string;
  videoUrl?: string;
  // Related IDs for navigation
  programId?: number;
  programName?: string;
  workoutId?: number;
  workoutName?: string;
  mealId?: number;
  mealName?: string;
  trainingPlanId?: number;
  trainingPlanName?: string;
  nutritionPlanId?: number;
  nutritionPlanName?: string;
}

export interface DetailedExercise {
  id: number;
  name: string;
  duration: number | null;
  difficulty: string | null;
  equipment: string[] | null;
  muscleGroups: string[] | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  instructions: string | null;
  workoutId: number | null;
  workoutName: string | null;
  mealId: number | null;
  mealName: string | null;
  trainingPlanId: number | null;
  trainingPlanName: string | null;
  nutritionPlanId: number | null;
  nutritionPlanName: string | null;
  programId: number | null;
  programName: string | null;
  isFavorited: boolean;
}

export interface DetailedRecipe {
  id: number;
  name: string;
  portions: number | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  prepTime: number | null;
  cookTime: number | null;
  ingredients: Array<{
    order: number;
    foodName: string;
    measurement: string;
    servings: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }> | null;
  instructions: string | null;
  thumbnailUrl: string | null;
  mealId: number | null;
  mealName: string | null;
  workoutId: number | null;
  workoutName: string | null;
  nutritionPlanId: number | null;
  nutritionPlanName: string | null;
  trainingPlanId: number | null;
  trainingPlanName: string | null;
  programId: number | null;
  programName: string | null;
  isFavorited: boolean;
}

export interface DetailedWorkout {
  id: number;
  name: string;
  description: string | null;
  type: string;
  day: number;
  duration: number | null;
  difficulty: string | null;
  thumbnailUrl: string | null;
  trainingPlanId: number | null;
  isFavorited: boolean;
}

export interface DetailedMeal {
  id: number;
  name: string;
  description: string | null;
  type: string;
  day: number;
  mealType: string;
  calories: number | null;
  nutritionPlanId: number | null;
  isFavorited: boolean;
}

export interface DetailedFood {
  id: number;
  name: string;
  description: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  unit: string;
  isFavorited: boolean;
}

export interface DetailedProgram {
  id: number;
  name: string;
  description: string | null;
  type: string;
  duration: number;
  level: string;
  trainingPlanId: string | null;
  nutritionPlanId: string | null;
  thumbnailUrl: string | null;
  isFavorited: boolean;
}

export interface DetailedTrainingPlan {
  id: number;
  name: string;
  description: string | null;
  type: string;
  duration: number;
  level: string;
  daysPerWeek: number;
  isFavorited: boolean;
}

export interface DetailedNutritionPlan {
  id: number;
  name: string;
  description: string | null;
  type: string;
  format: string;
  caloriesTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  isFavorited: boolean;
}

export interface DetailedFavoritesResponse {
  success: boolean;
  data: {
    workouts: DetailedWorkout[];
    meals: DetailedMeal[];
    recipes: DetailedRecipe[];
    exercises: DetailedExercise[];
    foods: DetailedFood[];
    programs: DetailedProgram[];
    training_plans: DetailedTrainingPlan[];
    nutrition_plans: DetailedNutritionPlan[];
  };
  pagination: {
    limit: number;
    offset: number;
    totalCounts: {
      workouts: number;
      meals: number;
      recipes: number;
      exercises: number;
      foods: number;
      programs: number;
      training_plans: number;
      nutrition_plans: number;
    };
  };
}

export interface FavoritesResponse {
  success: boolean;
  data: {
    exercises: number[];
    recipes: number[];
    workouts: number[];
    meals: number[];
    foods: number[];
    programs: number[];
    training_plans: number[];
    nutrition_plans: number[];
  };
  totalFavorites: number;
}

export interface ToggleFavoriteResponse {
  success: boolean;
  data: {
    isFavorited: boolean;
    totalFavorites: number;
  };
}

