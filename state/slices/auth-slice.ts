import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Relationship {
  id: string;
  role: string;
  name: string;
  company_id: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  profile_picture?: string;
  relationships?: Relationship[];
  userMeta?: Array<{
    meta_key: string;
    meta_value: string;
  }>;
}

interface AuthState {
  token?: string;
  isAuthenticated: boolean;
  user?: User;
  selectedCompanyId?: string;
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
      // Auto-select first company if user is set and no company is selected
      if (action.payload?.relationships && action.payload.relationships.length > 0 && !state.selectedCompanyId) {
        state.selectedCompanyId = action.payload.relationships[0].company_id;
      }
    },
    setSelectedCompany(state, action: PayloadAction<string | undefined>) {
      state.selectedCompanyId = action.payload;
    },
    logout() {
      return initialState;
    },
  },
});

export const { setToken, setUser, setSelectedCompany, logout } = authSlice.actions;
export default authSlice.reducer;

