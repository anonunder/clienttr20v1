import { env } from '../../config/env';
import { getTokenSecure, clearTokenSecure } from '../auth/auth-storage';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
}

// Callback to handle logout when token expires
// This will be set by the store setup to avoid circular dependencies
let onTokenExpiredCallback: (() => void) | null = null;

export function setTokenExpiredCallback(callback: () => void) {
  onTokenExpiredCallback = callback;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const method = options.method || 'GET';
  const token = await getTokenSecure();

  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  // Handle JWT expiration
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    
    // Check if response contains JWT expiration message
    try {
      const errorData = JSON.parse(text);
      if (errorData?.message === 'jwt expired' || errorData?.message?.toLowerCase().includes('jwt expired')) {
        // Automatically log out user - clear token and trigger callback
        await clearTokenSecure();
        
        // Call the logout callback if registered
        if (onTokenExpiredCallback) {
          onTokenExpiredCallback();
        }
        
        throw new Error('Session expired. Please login again.');
      }
    } catch (parseError) {
      // If parsing fails, continue with original error
      if (parseError instanceof Error && parseError.message === 'Session expired. Please login again.') {
        throw parseError; // Re-throw logout error
      }
    }
    
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }

  return (await res.json()) as T;
}

