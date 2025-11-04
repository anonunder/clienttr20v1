/**
 * Socket Events for Dashboard
 * Centralized event names to prevent typos and ensure consistency
 */

// Events we LISTEN to (from server)
export const DASHBOARD_LISTEN_EVENTS = {
  // Exercise events
  EXERCISE_COMPLETED: 'dashboard:exercise:completed',
  EXERCISE_STARTED: 'dashboard:exercise:started',
  EXERCISE_UPDATED: 'dashboard:exercise:updated',
  
  // Workout events
  WORKOUT_PROGRESS: 'dashboard:workout:progress',
  WORKOUT_COMPLETED: 'dashboard:workout:completed',
  WORKOUT_STARTED: 'dashboard:workout:started',
  
  // Meal events
  MEAL_LOGGED: 'dashboard:meal:logged',
  MEAL_UPDATED: 'dashboard:meal:updated',
  MEAL_DELETED: 'dashboard:meal:deleted',
  
  // Goal events
  GOAL_PROGRESS: 'dashboard:goal:progress',
  GOAL_COMPLETED: 'dashboard:goal:completed',
  
  // Stats events
  STATS_UPDATED: 'dashboard:stats:updated',
  
  // Measurement events
  MEASUREMENT_ADDED: 'dashboard:measurement:added',
  MEASUREMENT_UPDATED: 'dashboard:measurement:updated',
  
  // Report events
  REPORT_GENERATED: 'dashboard:report:generated',
  
  // General updates
  DATA_REFRESH: 'dashboard:data:refresh',
} as const;

// Events we EMIT to (to server)
export const DASHBOARD_EMIT_EVENTS = {
  // Join/Leave room
  JOIN_DASHBOARD: 'dashboard:join',
  LEAVE_DASHBOARD: 'dashboard:leave',
  
  // Request updates
  REQUEST_STATS: 'dashboard:request:stats',
  REQUEST_EXERCISES: 'dashboard:request:exercises',
  REQUEST_MEALS: 'dashboard:request:meals',
  REQUEST_GOALS: 'dashboard:request:goals',
  
  // Mark actions
  MARK_EXERCISE_COMPLETE: 'dashboard:exercise:mark-complete',
  MARK_GOAL_COMPLETE: 'dashboard:goal:mark-complete',
  
  // Sync request
  SYNC_DATA: 'dashboard:sync',
} as const;

export type DashboardListenEvent = typeof DASHBOARD_LISTEN_EVENTS[keyof typeof DASHBOARD_LISTEN_EVENTS];
export type DashboardEmitEvent = typeof DASHBOARD_EMIT_EVENTS[keyof typeof DASHBOARD_EMIT_EVENTS];

