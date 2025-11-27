import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { DashboardResponse, WeeklyOverviewResponse } from '@/types/dashboard';

/**
 * Dashboard Service
 * Handles all API calls for dashboard data
 */

/**
 * Fetch complete dashboard data
 * @param companyId - Company ID to fetch dashboard for
 * @returns Complete dashboard data
 */
export async function getDashboardData(companyId: number): Promise<DashboardResponse> {
  const endpoint = endpoints.dashboard.overview(companyId);
  return api<DashboardResponse>(endpoint);
}

/**
 * Fetch weekly overview with daily breakdown
 * @param companyId - Company ID to fetch weekly overview for
 * @returns Weekly overview data
 */
export async function getWeeklyOverview(companyId: number): Promise<WeeklyOverviewResponse> {
  const endpoint = endpoints.dashboard.weekly(companyId);
  return api<WeeklyOverviewResponse>(endpoint);
}

/**
 * Fetch active programs summary
 * @param companyId - Company ID to fetch programs for
 * @returns Active programs data
 */
export async function getActiveProgramsSummary(companyId: number) {
  const endpoint = endpoints.dashboard.programs(companyId);
  return api(endpoint);
}

/**
 * Fetch workout statistics
 * @param companyId - Company ID to fetch workout stats for
 * @returns Workout statistics
 */
export async function getWorkoutStatistics(companyId: number) {
  const endpoint = endpoints.dashboard.workouts(companyId);
  return api(endpoint);
}

/**
 * Fetch daily progress
 * @param companyId - Company ID to fetch daily progress for
 * @returns Daily progress data
 */
export async function getDailyProgress(companyId: number) {
  const endpoint = endpoints.dashboard.daily(companyId);
  return api(endpoint);
}

