import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token?: string;
  isAuthenticated: boolean;
  user?: User;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | undefined>) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUser(state, action: PayloadAction<User | undefined>) {
      state.user = action.payload;
    },
    logout() {
      return initialState;
    },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

