/**
 * Dashboard Feature Module
 * 
 * Exports all dashboard-related functionality:
 * - Slice and actions
 * - Thunks (async operations)
 * - Selectors (data access)
 * - Types
 */

// Slice and Actions
export { default as dashboardReducer } from './dashboard-slice';
export * from './dashboard-slice';

// Async Thunks
export * from './dashboard-thunks';

// Selectors
export * from './dashboard-selectors';

// Service (for direct API access if needed)
export * as dashboardService from './dashboard-service';
