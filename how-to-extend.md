# How to Extend Dashboard Pattern for New Pages

This guide explains how to create new pages following the dashboard pattern. All data flows through Redux, ensuring consistent state management and real-time updates.

## Data Flow Architecture

```
Screen Component → Custom Hook → Redux Thunk → API (via endpoints.ts) → Redux Slice → Selectors → Hook → UI Update
```

## Required File Structure

### 1. Redux Slice (`features/[name]/[name]-slice.ts`)

Define state interface, initial state, and slice with reducers for state updates.

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetch[Name]Data } from './[name]-thunks';

export interface [Name]Data {
  // Define your data structure
}

interface [Name]State {
  data: [Name]Data | null;
  loading: boolean;
  error: string | null;
}

const initialState: [Name]State = {
  data: null,
  loading: false,
  error: null,
};

const [name]Slice = createSlice({
  name: '[name]',
  initialState,
  reducers: {
    // Real-time update reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch[Name]Data.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetch[Name]Data.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetch[Name]Data.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default [name]Slice.reducer;
```

### 2. Redux Thunks (`features/[name]/[name]-thunks.ts`)

Create async thunk that fetches data using endpoints. Import `api` from `@/services/api-client` and `endpoints` from `@/services/api-client/endpoints`.

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';
import { [Name]Data } from './[name]-slice';

export const fetch[Name]Data = createAsyncThunk(
  '[name]/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api<[Name]Data>(endpoints.[name].data());
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch data');
    }
  }
);
```

**Important**: First add endpoint to `services/api-client/endpoints.ts`:
```typescript
export const endpoints = {
  // ... existing endpoints
  [name]: {
    data: () => '/[name]/data',
  },
};
```

### 3. Redux Selectors (`features/[name]/[name]-selectors.ts`)

Export typed selectors using `RootState` with optional chaining for safety.

```typescript
import { RootState } from '@/state/store';

export const select[Name]Data = (state: RootState) => 
  state.[name]?.data || null;
export const select[Name]Loading = (state: RootState) => 
  state.[name]?.loading || false;
export const select[Name]Error = (state: RootState) => 
  state.[name]?.error || null;
```

### 4. Custom Hook (`hooks/[name]/use-[name]-data.ts`)

Orchestrates data fetching and provides state to components. Uses `useDispatch` and `useSelector`.

```typescript
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/state/store';
import { fetch[Name]Data } from '@/features/[name]/[name]-thunks';
import {
  select[Name]Data,
  select[Name]Loading,
  select[Name]Error,
} from '@/features/[name]/[name]-selectors';

export const use[Name]Data = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const data = useSelector(select[Name]Data);
  const loading = useSelector(select[Name]Loading);
  const error = useSelector(select[Name]Error);

  const initialize[Name] = useCallback(async () => {
    await dispatch(fetch[Name]Data()).unwrap();
  }, [dispatch]);

  const refresh = useCallback(async () => {
    await dispatch(fetch[Name]Data()).unwrap();
  }, [dispatch]);

  return {
    data,
    loading,
    error,
    initialize[Name],
    refresh,
  };
};
```

### 5. Screen Component (`app/(protected)/(tabs)/[route]/index.tsx`)

Use the custom hook, initialize on mount, handle loading/error states.

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { MainLayout } from '@/components/layout/MainLayout';
import { use[Name]Data } from '@/hooks/[name]/use-[name]-data';

export default function [Name]Screen() {
  const { data, loading, error, initialize[Name], refresh } = use[Name]Data();

  React.useEffect(() => {
    initialize[Name]().catch(console.error);
  }, [initialize[Name]]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <MainLayout title="[Name]">
      {/* Render your data */}
    </MainLayout>
  );
}
```

### 6. Register Reducer (`state/store.ts`)

Add reducer to store configuration.

```typescript
import [name]Reducer from '@/features/[name]/[name]-slice';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    [name]: [name]Reducer,
  },
});
```

## Complete Dashboard Example

### Step 1: Add Endpoint (`services/api-client/endpoints.ts`)
```typescript
export const endpoints = {
  auth: { /* ... */ },
  dashboard: {
    data: () => '/dashboard/data',
  },
};
```

### Step 2: Redux Slice (`features/dashboard/dashboard-slice.ts`)
```typescript
export interface DashboardData {
  stats: Stats;
  todayExercises: Exercise[];
  todayMeals: TodayMeals;
  // ... more fields
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { data: null, loading: false, error: null },
  reducers: {
    updateExerciseCompletion: (state, action) => {
      // Real-time update logic
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  },
});
```

### Step 3: Redux Thunk (`features/dashboard/dashboard-thunks.ts`)
```typescript
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api<DashboardData>(endpoints.dashboard.data());
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Step 4: Selectors (`features/dashboard/dashboard-selectors.ts`)
```typescript
export const selectDashboardData = (state: RootState) => 
  state.dashboard?.data || null;
export const selectDashboardStats = (state: RootState) => 
  state.dashboard?.data?.stats;
```

### Step 5: Custom Hook (`hooks/dashboard/use-dashboard-data.ts`)
```typescript
export const useDashboardData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const stats = useSelector(selectDashboardStats);
  const loading = useSelector(selectDashboardLoading);

  const initializeDashboard = useCallback(async () => {
    await dispatch(fetchDashboardData()).unwrap();
  }, [dispatch]);

  return { stats, loading, initializeDashboard };
};
```

### Step 6: Screen Component (`app/(protected)/(tabs)/home/index.tsx`)
```typescript
export default function DashboardScreen() {
  const { stats, loading, initializeDashboard } = useDashboardData();

  React.useEffect(() => {
    initializeDashboard().catch(console.error);
  }, [initializeDashboard]);

  return (
    <MainLayout title="Dashboard">
      <DashboardStats stats={stats} />
    </MainLayout>
  );
}
```

## Key Principles

1. **Endpoints First**: Always add endpoint to `endpoints.ts` before creating thunk
2. **Redux-Only**: Components never call API directly—always use Redux selectors
3. **Typed Selectors**: Use TypeScript with `RootState` for type safety
4. **Error Handling**: Handle loading/error states in components
5. **Initialization**: Call `initialize[Name]()` in `useEffect` on mount
6. **Refresh Pattern**: Expose `refresh()` function for pull-to-refresh

## Best Practices

- Use optional chaining (`?.`) in selectors for safety
- Provide default/fallback values in hooks
- Keep thunks focused—one thunk per API endpoint
- Use `createAsyncThunk` for all async operations
- Handle errors gracefully with `rejectWithValue`
- Export actions from slice for real-time updates

