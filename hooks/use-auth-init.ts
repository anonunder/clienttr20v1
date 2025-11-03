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
          // Validate token with backend
          const user = await getCurrentUser();

          if (user) {
            dispatch(setToken(token));
            dispatch(setUser(user));
          } else {
            // Token invalid, clear it from storage and Redux
            await clearTokenSecure();
            dispatch(logout());
          }
        } else {
          // No token found, ensure Redux is cleared
          dispatch(logout());
        }
      } catch (error) {
        // If validation fails, clear auth state from storage and Redux
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

