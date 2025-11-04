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
  },
};

