import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark' | 'auto';
  isLoading: boolean;
  notification?: {
    message: string;
    type: 'success' | 'error' | 'info';
  };
}

const initialState: UiState = {
  theme: 'auto',
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark' | 'auto'>) {
      state.theme = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setNotification(
      state,
      action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' } | undefined>,
    ) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = undefined;
    },
  },
});

export const { setTheme, setLoading, setNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;

