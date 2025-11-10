export const endpoints = {
  auth: {
    login: () => '/auth/login',
    logout: () => '/auth/logout',
    refresh: () => '/auth/refresh',
    me: () => '/auth/verify-user',
  },
  programs: {
    list: (companyId: number) => `/client/programs?companyId=${companyId}`,
    detail: (id: number, companyId: number) => `/client/program/${id}?companyId=${companyId}`,
    training: (programId: number, companyId: number) => `/client/program/${programId}/training?companyId=${companyId}`,
    nutrition: (programId: number, companyId: number) => `/client/program/${programId}/nutrition?companyId=${companyId}`,
    meal: (programId: number, mealId: number, companyId: number) => 
      `/client/program/${programId}/nutrition/meals/${mealId}?companyId=${companyId}`,
    recipe: (programId: number, recipeId: number, companyId: number) => 
      `/client/program/${programId}/nutrition/recipes/${recipeId}?companyId=${companyId}`,
    exercise: (programId: number, workoutId: number, exerciseId: number, companyId: number) => 
      `/client/programs/${programId}/training/${workoutId}/exercise/${exerciseId}?companyId=${companyId}`,
  },
};

