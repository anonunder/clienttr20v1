import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { logout } from '@/state/slices/auth-slice';
import { clearTokenSecure } from '@/services/auth/auth-storage';

/**
 * Auth Hook
 * Reads authentication state from Redux
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    await clearTokenSecure();
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    logout: handleLogout,
  };
};

