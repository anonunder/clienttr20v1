import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchProgramsList, 
  fetchProgramDetail, 
  fetchTrainingPlan, 
  fetchNutritionPlan, 
  fetchMealDetail, 
  fetchRecipeDetail,
  toggleWorkoutFavorite,
  fetchWorkoutFavorites,
  addWorkoutComment,
  fetchWorkoutComments,
} from './programs-thunks';

// Types matching API response
export interface TrainingPlan {
  id: string;
  title: string;
}

// Training Plan Detail Types
export interface TrainingPlanMeta {
  meta_id: number;
  post_id: number;
  meta_key: string;
  meta_value: string;
}

export interface ReferencedMedia {
  id: number;
  post_content: string;
  PostMeta: {
    meta_id: number;
    post_id: number;
    meta_key: string;
    meta_value: string;
  };
}

export interface WorkoutExercise {
  term_taxonomy_id: number;
  term_id: number;
  description?: string;
  term?: {
    name?: string;
    meta?: {
      sets?: any[];
      [key: string]: any;
    };
  };
  media?: {
    exercise_thumbnail_media_id?: {
      post_content?: string;
      post_mime_type?: string;
    };
    demo_media_id?: {
      post_content?: string;
      post_mime_type?: string;
    };
  };
}

export interface TrainingPlanWorkout {
  id: number;
  post_type: string;
  post_title: string;
  post_content: string;
  menu_order: number;
  post_parent: number;
  referencedMedia: ReferencedMedia[];
  meta: TrainingPlanMeta[];
  workoutExercises: WorkoutExercise[];
}

export interface TrainingPlanDay {
  dayNumber: number;
  trainingPlanDayWorkouts: TrainingPlanWorkout[];
}

export interface ProgramData {
  id: number;
  title: string;
  description: string;
  imageUri: string | null;
  duration: string | null;
  difficulty: string;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  autoRevealDays?: number | null;
  dateAssigned: string;
  trainerId: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface TrainingPlanDetail {
  id: number;
  post_title: string;
  post_content: string;
  post_date: string;
  post_type: string;
  termTaxonomies: any[];
  meta: TrainingPlanMeta[];
  trainingPlanDays: TrainingPlanDay[];
  imageUri: string | null;
  program?: ProgramData;
}

export interface NutritionPlan {
  id: string;
  title: string;
}

// Nutrition Plan Detail Types
export interface NutritionPlanMeta {
  meta_id: number;
  post_id: number;
  meta_key: string;
  meta_value: string;
}

export interface MealIngredient {
  order: number;
  foodName: string;
  measurement: string;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealRecipe {
  term_taxonomy_id: number;
  term_id: number;
  taxonomy: string;
  description: string | null;
  post_parent: number;
  term: {
    name: string;
    date: string;
    meta: {
      description?: {
        text: string;
        editorState: string;
      };
      content?: string;
      ingredients?: string;
      recipe?: string;
      recipe_thumbnail_media_id?: string;
    };
  };
  parentTaxonomy: any;
  alternativeExercises: any[];
  media: {
    recipe_thumbnail_media_id?: {
      id: number;
      post_title: string;
      post_content: string;
      post_mime_type: string;
    };
  };
  isFavorited?: boolean; // Added from backend
}

export interface NutritionPlanMeal {
  id: number;
  post_type: string;
  post_title: string;
  post_content: string;
  menu_order: number;
  post_parent: number;
  referencedMedia: ReferencedMedia[];
  meta: NutritionPlanMeta[];
  mealRecipes: MealRecipe[];
}

export interface NutritionPlanDay {
  dayNumber: number;
  nutritionPlanDayMeals: NutritionPlanMeal[];
}

export interface NutritionPlanMealGroup {
  meta_id: number;
  mealGroupName: string;
  nutritionPlanGroupMeals: NutritionPlanMeal[];
}

export interface NutritionPlanDetail {
  id: number;
  post_title: string;
  post_content: string;
  post_date: string;
  post_type: string;
  post_mime_type: string;
  termTaxonomies: any[];
  meta: NutritionPlanMeta[];
  nutritionPlanDays?: NutritionPlanDay[];
  nutritionPlanMealGroups?: NutritionPlanMealGroup[];
  imageUri: string | null;
  program?: ProgramData;
}

// Meal Detail Type (extends NutritionPlanMeal with programId)
export interface MealDetail extends NutritionPlanMeal {
  programId: number;
  isFavorited?: boolean; // Added from backend
}

// Recipe Detail Types
export interface RecipeMedia {
  id: number;
  post_title: string;
  post_content: string;
  post_mime_type: string;
}

export interface RecipeDetail {
  term_taxonomy_id: number;
  term_id: number;
  taxonomy: string;
  description: string | null;
  post_parent: number;
  term: {
    name: string;
    date: string;
    meta: {
      description?: {
        text: string;
        editorState: string;
      };
      ingredients?: string;
      instructions?: string;
      recipe_thumbnail_media_id?: string;
      demo_media_id?: string[];
    };
  };
  parentTaxonomy: any;
  alternativeExercises: any[];
  media: {
    recipe_thumbnail_media_id?: RecipeMedia;
    demo_media_id?: RecipeMedia[];
  };
  nutritionPlanId: number;
  programId: number;
  isFavorited?: boolean; // Added from backend
}

export interface WorkoutComment {
  userId: number;
  userName: string;
  userProfileImage?: string;
  date: string;
  comment: string;
}


export interface Program {
  id: number;
  title: string;
  description: string;
  imageUri: string | null;
  duration: string | null;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  trainer: string;
  trainingPlan?: TrainingPlan | null;
  nutritionPlan?: NutritionPlan | null;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  autoRevealDays?: number | null;
  hasTrainingPlan: boolean;
  hasNutritionPlan: boolean;
  trainingPlanId?: string;
  nutritionPlanId?: string;
  clientId: string;
  dateAssigned: string;
  trainerId: number;
  createdAt: string;
  updatedAt: string | null;
}

interface ProgramsState {
  programs: Program[];
  programDetail: Program | null;
  trainingPlan: TrainingPlanDetail | null;
  nutritionPlan: NutritionPlanDetail | null;
  mealDetail: MealDetail | null;
  recipeDetail: RecipeDetail | null;
  loading: boolean;
  detailLoading: boolean;
  trainingPlanLoading: boolean;
  nutritionPlanLoading: boolean;
  mealDetailLoading: boolean;
  recipeDetailLoading: boolean;
  error: string | null;
  detailError: string | null;
  trainingPlanError: string | null;
  nutritionPlanError: string | null;
  mealDetailError: string | null;
  recipeDetailError: string | null;
  lastUpdated: number | null;
  // Favorites
  favoriteWorkouts: number[];
  favoriteStatus: { [workoutId: number]: boolean };
  favoritesLoading: boolean;
  favoritesError: string | null;
  // Comments
  workoutComments: { [workoutId: number]: WorkoutComment[] };
  commentsLoading: boolean;
  commentsError: string | null;
}

const initialState: ProgramsState = {
  programs: [],
  programDetail: null,
  trainingPlan: null,
  nutritionPlan: null,
  mealDetail: null,
  recipeDetail: null,
  loading: false,
  detailLoading: false,
  trainingPlanLoading: false,
  nutritionPlanLoading: false,
  mealDetailLoading: false,
  recipeDetailLoading: false,
  error: null,
  detailError: null,
  trainingPlanError: null,
  nutritionPlanError: null,
  mealDetailError: null,
  recipeDetailError: null,
  lastUpdated: null,
  // Favorites
  favoriteWorkouts: [],
  favoriteStatus: {},
  favoritesLoading: false,
  favoritesError: null,
  // Comments
  workoutComments: {},
  commentsLoading: false,
  commentsError: null,
};

const programsSlice = createSlice({
  name: 'programs',
  initialState,
  reducers: {
    clearPrograms: (state) => {
      state.programs = [];
      state.error = null;
      state.lastUpdated = null;
    },
    clearFavorites: (state) => {
      state.favoriteWorkouts = [];
      state.favoriteStatus = {};
      state.favoritesError = null;
    },
    clearComments: (state) => {
      state.workoutComments = {};
      state.commentsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgramsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramsList.fulfilled, (state, action) => {
        state.loading = false;
        state.programs = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchProgramsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProgramDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProgramDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.programDetail = action.payload;
      })
      .addCase(fetchProgramDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      })
      .addCase(fetchTrainingPlan.pending, (state) => {
        state.trainingPlanLoading = true;
        state.trainingPlanError = null;
        state.trainingPlan = null; // Clear previous training plan
      })
      .addCase(fetchTrainingPlan.fulfilled, (state, action) => {
        state.trainingPlanLoading = false;
        state.trainingPlan = action.payload;
      })
      .addCase(fetchTrainingPlan.rejected, (state, action) => {
        state.trainingPlanLoading = false;
        state.trainingPlanError = action.payload as string;
        state.trainingPlan = null; // Clear on error
      })
      .addCase(fetchNutritionPlan.pending, (state) => {
        state.nutritionPlanLoading = true;
        state.nutritionPlanError = null;
        state.nutritionPlan = null; // Clear previous nutrition plan
      })
      .addCase(fetchNutritionPlan.fulfilled, (state, action) => {
        state.nutritionPlanLoading = false;
        state.nutritionPlan = action.payload;
      })
      .addCase(fetchNutritionPlan.rejected, (state, action) => {
        state.nutritionPlanLoading = false;
        state.nutritionPlanError = action.payload as string;
        state.nutritionPlan = null; // Clear on error
      })
      .addCase(fetchMealDetail.pending, (state) => {
        state.mealDetailLoading = true;
        state.mealDetailError = null;
        state.mealDetail = null; // Clear previous meal detail
      })
      .addCase(fetchMealDetail.fulfilled, (state, action) => {
        state.mealDetailLoading = false;
        state.mealDetail = action.payload;
      })
      .addCase(fetchMealDetail.rejected, (state, action) => {
        state.mealDetailLoading = false;
        state.mealDetailError = action.payload as string;
        state.mealDetail = null; // Clear on error
      })
      .addCase(fetchRecipeDetail.pending, (state) => {
        state.recipeDetailLoading = true;
        state.recipeDetailError = null;
        state.recipeDetail = null; // Clear previous recipe detail
      })
      .addCase(fetchRecipeDetail.fulfilled, (state, action) => {
        state.recipeDetailLoading = false;
        state.recipeDetail = action.payload;
      })
      .addCase(fetchRecipeDetail.rejected, (state, action) => {
        state.recipeDetailLoading = false;
        state.recipeDetailError = action.payload as string;
        state.recipeDetail = null; // Clear on error
      })
      // Toggle workout favorite
      .addCase(toggleWorkoutFavorite.pending, (state) => {
        state.favoritesLoading = true;
        state.favoritesError = null;
      })
      .addCase(toggleWorkoutFavorite.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        const { workoutId, isFavorited } = action.payload;
        state.favoriteStatus[workoutId] = isFavorited;
        
        if (isFavorited) {
          if (!state.favoriteWorkouts.includes(workoutId)) {
            state.favoriteWorkouts.push(workoutId);
          }
        } else {
          state.favoriteWorkouts = state.favoriteWorkouts.filter(
            id => id !== workoutId
          );
        }
      })
      .addCase(toggleWorkoutFavorite.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.favoritesError = action.payload as string;
      })
      // Fetch workout favorites
      .addCase(fetchWorkoutFavorites.pending, (state) => {
        state.favoritesLoading = true;
        state.favoritesError = null;
      })
      .addCase(fetchWorkoutFavorites.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.favoriteWorkouts = action.payload;
        // Update favorite status map
        action.payload.forEach(workoutId => {
          state.favoriteStatus[workoutId] = true;
        });
      })
      .addCase(fetchWorkoutFavorites.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.favoritesError = action.payload as string;
      })
      // Add workout comment
      .addCase(addWorkoutComment.pending, (state) => {
        state.commentsLoading = true;
        state.commentsError = null;
      })
      .addCase(addWorkoutComment.fulfilled, (state, action) => {
        state.commentsLoading = false;
        const { workoutId, comment } = action.payload;
        if (!state.workoutComments[workoutId]) {
          state.workoutComments[workoutId] = [];
        }
        state.workoutComments[workoutId].unshift(comment);
      })
      .addCase(addWorkoutComment.rejected, (state, action) => {
        state.commentsLoading = false;
        state.commentsError = action.payload as string;
      })
      // Fetch workout comments
      .addCase(fetchWorkoutComments.pending, (state) => {
        state.commentsLoading = true;
        state.commentsError = null;
      })
      .addCase(fetchWorkoutComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        const { workoutId, comments } = action.payload;
        state.workoutComments[workoutId] = comments;
      })
      .addCase(fetchWorkoutComments.rejected, (state, action) => {
        state.commentsLoading = false;
        state.commentsError = action.payload as string;
      });
  },
});

export const { clearPrograms, clearFavorites, clearComments } = programsSlice.actions;
export default programsSlice.reducer;

