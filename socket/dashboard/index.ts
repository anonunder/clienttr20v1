/**
 * Dashboard Socket Module
 * Centralized exports for dashboard socket functionality
 */

export * from './events';
export * from './types';
export * from './emitters';
export * from './listeners';

// Re-export instances for convenience
export { dashboardEmitters } from './emitters';
export { dashboardListeners } from './listeners';

