import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setToken, setUser, logout } from '../../state/slices/auth-slice';

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it('should handle initial state', () => {
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeUndefined();
    expect(state.user).toBeUndefined();
  });

  it('should handle setToken', () => {
    store.dispatch(setToken('test-token'));
    const state = store.getState().auth;
    expect(state.token).toBe('test-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle setUser', () => {
    const user = { id: '1', name: 'Test User', email: 'test@example.com' };
    store.dispatch(setUser(user));
    const state = store.getState().auth;
    expect(state.user).toEqual(user);
  });

  it('should handle logout', () => {
    store.dispatch(setToken('test-token'));
    store.dispatch(setUser({ id: '1', name: 'Test User', email: 'test@example.com' }));
    store.dispatch(logout());
    const state = store.getState().auth;
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeUndefined();
    expect(state.user).toBeUndefined();
  });
});

