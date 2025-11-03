export const endpoints = {
  auth: {
    login: () => '/auth/login',
    logout: () => '/auth/logout',
    refresh: () => '/auth/refresh',
    me: () => '/auth/me',
  },
  plans: {
    list: (page = 1) => `/plans?page=${page}`,
    byId: (id: string) => `/plans/${id}`,
  },
  trainingPlans: {
    list: () => '/training-plans',
    byId: (id: string) => `/training-plans/${id}`,
    workouts: (planId: string) => `/training-plans/${planId}/workouts`,
    workout: (planId: string, workoutId: string) =>
      `/training-plans/${planId}/workouts/${workoutId}`,
    exercise: (planId: string, workoutId: string, exerciseId: string) =>
      `/training-plans/${planId}/workouts/${workoutId}/exercises/${exerciseId}`,
  },
  nutritionPlans: {
    list: () => '/nutrition-plans',
    byId: (id: string) => `/nutrition-plans/${id}`,
    meals: (planId: string) => `/nutrition-plans/${planId}/meals`,
    meal: (planId: string, mealId: string) => `/nutrition-plans/${planId}/meals/${mealId}`,
  },
  progress: {
    summary: () => '/progress/summary',
    workouts: () => '/progress/workouts',
    nutrition: () => '/progress/nutrition',
  },
  chat: {
    messages: (roomId?: string) => (roomId ? `/chat/rooms/${roomId}/messages` : '/chat/messages'),
    send: (roomId?: string) => (roomId ? `/chat/rooms/${roomId}/send` : '/chat/send'),
  },
  questionnaires: {
    list: () => '/questionnaires',
    active: () => '/questionnaires/active',
    completed: () => '/questionnaires/completed',
    byId: (id: string) => `/questionnaires/${id}`,
    submit: (id: string) => `/questionnaires/${id}/submit`,
  },
};

