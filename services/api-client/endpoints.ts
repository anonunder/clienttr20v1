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
    workout: (programId: number, workoutId: number, companyId: number) => 
      `/client/programs/${programId}/training/${workoutId}?companyId=${companyId}`,
    exercise: (programId: number, workoutId: number, exerciseId: number, companyId: number) => 
      `/client/programs/${programId}/training/${workoutId}/exercise/${exerciseId}?companyId=${companyId}`,
  },
  workoutSessions: {
    start: () => '/client/workout-sessions/start',
    update: (sessionId: number) => `/client/workout-sessions/${sessionId}`,
    list: (companyId: number) => `/client/workout-sessions?companyId=${companyId}`,
    detail: (sessionId: number, companyId: number) => `/client/workout-sessions/${sessionId}?companyId=${companyId}`,
    delete: (sessionId: number) => `/client/workout-sessions/${sessionId}`,
  },
  favorites: {
    toggle: (entityType: string, entityId: number) => `/client/favorites/${entityType}/${entityId}`,
    list: (companyId: number) => `/client/favorites?companyId=${companyId}`,
    listByType: (entityType: string, companyId: number) => `/client/favorites/${entityType}?companyId=${companyId}`,
    detailed: (params: { companyId: number; limit?: number; offset?: number; entityType?: string }) => {
      const query = new URLSearchParams({
        companyId: params.companyId.toString(),
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.offset && { offset: params.offset.toString() }),
        ...(params.entityType && { entityType: params.entityType }),
      });
      return `/client/favorites/detailed?${query.toString()}`;
    },
    status: (entityType: string, entityId: number, companyId: number) => 
      `/client/favorites/${entityType}/${entityId}/status?companyId=${companyId}`,
  },
  comments: {
    add: (entityType: string, entityId: number) => `/client/comments/${entityType}/${entityId}`,
    list: (entityType: string, entityId: number, companyId: number) => 
      `/client/comments/${entityType}/${entityId}?companyId=${companyId}`,
  },
  reports: {
    pending: (companyId: number) => `/client/reports/pending?companyId=${companyId}`,
    completed: (params: {
      companyId: number;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }) => {
      const query = new URLSearchParams({
        companyId: params.companyId.toString(),
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.offset && { offset: params.offset.toString() }),
      });
      return `/client/reports/completed?${query.toString()}`;
    },
    detail: (responseId: number, companyId: number) => 
      `/client/reports/${responseId}?companyId=${companyId}`,
    submit: (responseId: number) => 
      `/client/reports/${responseId}/submit`,
  },
  measurements: {
    templates: (companyId: number) => `/client/measurements/templates?companyId=${companyId}`,
    submit: () => '/client/measurements/submit',
    history: (params: {
      companyId: number;
      templateId?: number;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }) => {
      const query = new URLSearchParams({
        companyId: params.companyId.toString(),
        ...(params.templateId && { templateId: params.templateId.toString() }),
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.offset && { offset: params.offset.toString() }),
      });
      return `/client/measurements/history?${query.toString()}`;
    },
    detail: (measurementId: number, companyId: number) => 
      `/client/measurements/${measurementId}?companyId=${companyId}`,
    progress: (fieldName: string, params: {
      companyId: number;
      startDate?: string;
      endDate?: string;
    }) => {
      const query = new URLSearchParams({
        companyId: params.companyId.toString(),
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
      });
      return `/client/measurements/progress/${fieldName}?${query.toString()}`;
    },
  },
  dashboard: {
    overview: (companyId: number) => `/client/dashboard?companyId=${companyId}`,
    weekly: (companyId: number) => `/client/dashboard/weekly?companyId=${companyId}`,
    programs: (companyId: number) => `/client/dashboard/programs?companyId=${companyId}`,
    workouts: (companyId: number) => `/client/dashboard/workouts?companyId=${companyId}`,
    daily: (companyId: number) => `/client/dashboard/daily?companyId=${companyId}`,
  },
};

