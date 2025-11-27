import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { FavoritesResponse, DetailedFavoritesResponse } from '@/types/favorites';

/**
 * Favorites API Service
 * Handles all API calls related to favorites
 */

/**
 * Get all favorites grouped by type (IDs only)
 */
export async function getAllFavorites(companyId: number): Promise<FavoritesResponse> {
  const response = await api<FavoritesResponse>(
    endpoints.favorites.list(companyId),
    { method: 'GET' }
  );
  return response;
}

/**
 * Get detailed favorites with full entity data
 */
export async function getDetailedFavorites(params: {
  companyId: number;
  limit?: number;
  offset?: number;
  entityType?: string;
}): Promise<DetailedFavoritesResponse> {
  const response = await api<DetailedFavoritesResponse>(
    endpoints.favorites.detailed(params),
    { method: 'GET' }
  );
  return response;
}

/**
 * Get favorites by entity type
 */
export async function getFavoritesByType(
  entityType: string,
  companyId: number
): Promise<{ success: boolean; data: number[]; count: number }> {
  const response = await api<{ success: boolean; data: number[]; count: number }>(
    endpoints.favorites.listByType(entityType, companyId),
    { method: 'GET' }
  );
  return response;
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  entityType: string,
  entityId: number,
  companyId: number
): Promise<{ success: boolean; data: { isFavorited: boolean; totalFavorites: number } }> {
  const response = await api<{
    success: boolean;
    data: { isFavorited: boolean; totalFavorites: number };
  }>(endpoints.favorites.toggle(entityType, entityId), {
    method: 'POST',
    body: { companyId },
  });
  return response;
}

/**
 * Check if entity is favorited
 */
export async function checkFavoriteStatus(
  entityType: string,
  entityId: number,
  companyId: number
): Promise<{ success: boolean; data: { isFavorited: boolean } }> {
  const response = await api<{ success: boolean; data: { isFavorited: boolean } }>(
    endpoints.favorites.status(entityType, entityId, companyId),
    { method: 'GET' }
  );
  return response;
}

