import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken, setUser, logout } from '@/state/slices/auth-slice';
import { getTokenSecure, clearTokenSecure } from '@/services/auth/auth-storage';
import { getCurrentUser } from '@/services/auth/auth-service';

export function useAuthInit() {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const token = await getTokenSecure();

        if (token) {
          // Restore token to Redux immediately
          dispatch(setToken(token));
          
          // Try to validate token with backend (non-blocking)
          try {
            const user = await getCurrentUser();
            if (user) {
              dispatch(setUser(user));
            } else {
              // Token might be invalid, but keep it in Redux for now
              // User will be logged out on next API call if token is truly invalid
              console.warn('Failed to get current user, but keeping token');
            }
          } catch (error) {
            // Validation failed, but don't clear token immediately
            // It might be a network issue - keep token and let API calls handle it
            console.warn('Token validation failed:', error);
          }
        } else {
          // No token found, ensure Redux is cleared
          dispatch(logout());
        }
      } catch (error) {
        // If getting token fails, clear auth state
        console.error('Auth initialization error:', error);
        await clearTokenSecure();
        dispatch(logout());
      } finally {
        setIsInitialized(true);
      }
    }

    initializeAuth();
  }, [dispatch]);

  return { isInitialized };
}

