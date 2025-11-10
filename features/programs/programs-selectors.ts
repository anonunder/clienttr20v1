import { RootState } from '@/state/store';

export const selectPrograms = (state: RootState) => state.programs?.programs || [];
export const selectProgramsLoading = (state: RootState) => state.programs?.loading || false;
export const selectProgramsError = (state: RootState) => state.programs?.error || null;
export const selectProgramsLastUpdated = (state: RootState) => state.programs?.lastUpdated || null;

export const selectProgramDetail = (state: RootState) => state.programs?.programDetail || null;
export const selectProgramDetailLoading = (state: RootState) => state.programs?.detailLoading || false;
export const selectProgramDetailError = (state: RootState) => state.programs?.detailError || null;

export const selectTrainingPlan = (state: RootState) => state.programs?.trainingPlan || null;
export const selectTrainingPlanLoading = (state: RootState) => state.programs?.trainingPlanLoading || false;
export const selectTrainingPlanError = (state: RootState) => state.programs?.trainingPlanError || null;

export const selectNutritionPlan = (state: RootState) => state.programs?.nutritionPlan || null;
export const selectNutritionPlanLoading = (state: RootState) => state.programs?.nutritionPlanLoading || false;
export const selectNutritionPlanError = (state: RootState) => state.programs?.nutritionPlanError || null;

export const selectMealDetail = (state: RootState) => state.programs?.mealDetail || null;
export const selectMealDetailLoading = (state: RootState) => state.programs?.mealDetailLoading || false;
export const selectMealDetailError = (state: RootState) => state.programs?.mealDetailError || null;

export const selectRecipeDetail = (state: RootState) => state.programs?.recipeDetail || null;
export const selectRecipeDetailLoading = (state: RootState) => state.programs?.recipeDetailLoading || false;
export const selectRecipeDetailError = (state: RootState) => state.programs?.recipeDetailError || null;

