# Expo Monorepo‑ready Skeleton — Sonnet 4 Build Brief (Mobile‑First: iOS/Android, also Web)

You are Sonnet 4 acting as a senior TypeScript + Expo architect. Build an Expo (managed workflow) application for **mobile (iOS/Android)** and **web** that matches the structure below. Follow every rule and convention in this brief.

---

## 🎯 Goals

* Ship a production‑grade **skeleton app** with: API client, auth flow, Redux Toolkit state, TanStack Query for data, Socket.IO client, strongly typed events, modular hooks, and a **single‑file theme** using **NativeWind**.
* Use **Expo Router** for navigation (mobile + web) with deep linking.
* Provide scalable folders, strict TypeScript, Zod validation, error boundaries, a11y, i18n, and testing setup.
* Implement a storage abstraction that uses **EncryptedStorage** on native and **localStorage** on web.

---

## ✅ Global Rules (follow exactly)

**Code style**

* All code in **TypeScript**. Use **interfaces** (not `type` for object shapes where possible). Avoid `enum`; use string unions or maps.
* Functional programming; no classes for React components. Use `function` keyword for pure helpers.
* Prefer reducers (Context/Redux) over scattered `useState`. Memoize with `useMemo`/`useCallback` when necessary.
* Early‑return error handling; avoid nested `if/else`.
* File order: **exported component → subcomponents → helpers → static → types**.

**Naming & Folders**

* Folders **kebab‑case**: `components/auth-wizard`, `services/api-client`, etc.
* Favor **named exports**.

**UI/Styling**

* Use **NativeWind** (Tailwind for RN) for styling. Provide a **single `theme.ts`** for colors/tokens used in NativeWind config.
* Support dark mode via `useColorScheme` and NativeWind `className` toggles.
* Manage safe areas with `react-native-safe-area-context` (global provider + `SafeAreaView`).

**Navigation**

* Use **expo-router** (file‑based). Tabs for major areas; nested stacks for details. Support deep links and web routes.

**State & Data**

* Global UI/auth **Redux Toolkit** slices.
* Server state via **@tanstack/react-query**.
* Runtime validation with **Zod** (parse API responses and forms).

**Networking & Sockets**

* Fetch wrapper using `fetch` + abort controllers + Zod.
* **Socket.IO** client with a typed event map and hook `useSocket`.

**Performance**

* Lazy‑load non‑critical screens with dynamic imports + `Suspense`.
* Optimize images with `expo-image` (lazy, contentFit, known sizes).

**Security**

* Use HTTPS only; store tokens securely (EncryptedStorage native, localStorage web with safe key). Sanitize inputs.

**Testing**

* Unit tests with **Jest** + **React Native Testing Library**. E2E (critical flows) with **Detox**.

**i18n**

* Use `expo-localization` + `i18next` (or `react-i18next`). RTL ready.

**Tooling**

* Prettier, ESLint (strict), TS `"strict": true`.
* Sentry (optional placeholder) + an error boundary.

**Expo Docs**

* Adhere to Expo official docs for setup, config, security, OTA updates, and distribution.

---

## 🗂 Folder Structure (apps use expo-router)

```
app/                      # expo-router entry
  _layout.tsx             # Root layout (providers, theme, safe area)
  (tabs)/                 # Tab navigator group
    _layout.tsx           # Tabs: Home, Programs, Progress, Chat, Profile
    home/index.tsx
    programs/index.tsx
    programs/training-plans/[planId]/workouts/[workoutId]/index.tsx
    programs/training-plans/[planId]/workouts/[workoutId]/exercises/[exerciseId].tsx
    programs/nutrition-plans/[planId]/meals/[mealId]/index.tsx
    progress/index.tsx
    chat/index.tsx
    profile/index.tsx
  questionnaires/
    index.tsx             # All questionnaires
    active.tsx
    completed.tsx

assets/
  fonts/
  images/

components/
  common/
  charts/
  forms/
  list-items/

config/
  env.ts                  # expo-constants wrapper
  linking.ts              # deep link/universal link config

hooks/
  use-color-scheme.ts
  use-online-status.ts
  use-app-focus.ts

providers/
  app-providers.tsx       # SafeArea + Redux + Query + Theme + Gesture + Reanimated

services/
  api-client/
    index.ts              # fetch wrapper + interceptors
    endpoints.ts          # endpoint builders
    zod-schemas.ts        # response validators
  auth/
    auth-storage.ts       # platform storage abstraction
    auth-service.ts       # login/logout/refresh
  socket/
    socket-client.ts      # typed Socket.IO client
    socket-events.ts      # event map (types)

state/
  store.ts                # Redux store setup
  slices/
    auth-slice.ts
    ui-slice.ts

styles/
  theme.ts                # single source of truth tokens
  tailwind.config.js      # NativeWind config consuming theme tokens

types/
  api.ts                  # shared DTO interfaces
  domain.ts               # domain models (Plan, Workout, etc.)

utils/
  error-boundary.tsx
  logger.ts
  zod-helpers.ts

i18n/
  index.ts
  locales/
    en.json
    sr.json

tests/
  unit/
  e2e/

app.config.ts             # Expo config (managed workflow)
metro.config.js
babel.config.js
jest.config.js
```

---

## 🔧 Environment & Config (`config/env.ts`)

```ts
import Constants from 'expo-constants';

interface EnvShape { apiBaseUrl: string; socketUrl: string; sentryDsn?: string }

const expo = Constants.expoConfig || Constants.manifest2?.extra || {};

export const env: EnvShape = {
  apiBaseUrl: (Constants?.expoConfig?.extra as any)?.API_BASE_URL || '',
  socketUrl: (Constants?.expoConfig?.extra as any)?.SOCKET_URL || '',
  sentryDsn: (Constants?.expoConfig?.extra as any)?.SENTRY_DSN,
};

export function assertEnv() {
  if (!env.apiBaseUrl) throw new Error('API_BASE_URL is required');
  if (!env.socketUrl) throw new Error('SOCKET_URL is required');
}
```

In `app.config.ts` inject `extra`:

```ts
export default ({ config }) => ({
  ...config,
  extra: {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_URL,
    SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
    SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
    eas: { projectId: 'YOUR-EAS-ID' },
  },
  updates: { url: 'https://u.expo.dev/YOUR-EAS-ID' },
});
```

---

## 🎨 Theme (single file) — `styles/theme.ts`

```ts
export interface AppTheme {
  color: {
    primary: string; primary600: string; primary700: string;
    bg: string; bgMuted: string; card: string; text: string; textMuted: string; border: string;
    success: string; warning: string; danger: string;
  };
  radius: { sm: number; md: number; lg: number; xl: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
}

export const lightTheme: AppTheme = {
  color: {
    primary: '#10b981', primary600: '#059669', primary700: '#047857',
    bg: '#ffffff', bgMuted: '#f6f7f9', card: '#ffffff', text: '#0f172a', textMuted: '#475569', border: '#e5e7eb',
    success: '#22c55e', warning: '#f59e0b', danger: '#ef4444',
  },
  radius: { sm: 6, md: 10, lg: 14, xl: 20 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
};

export const darkTheme: AppTheme = {
  ...lightTheme,
  color: {
    ...lightTheme.color,
    bg: '#0b1220', bgMuted: '#111827', card: '#0f172a', text: '#e5e7eb', textMuted: '#94a3b8', border: '#1f2937',
  },
};
```

**NativeWind config (`tailwind.config.js`)** should consume token values (hard‑sync if no plugin):

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{tsx,ts}', './components/**/*.{tsx,ts}', './providers/**/*.{tsx,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        bg: '#ffffff',
        card: '#ffffff',
        text: '#0f172a',
        border: '#e5e7eb',
      },
      borderRadius: { xl: '20px' },
    },
  },
  plugins: [],
};
```

---

## 🧰 Providers — `providers/app-providers.tsx`

```tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../state/store';
import { useColorScheme } from 'react-native';

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

---

## 🧭 Routing — `app/_layout.tsx`

```tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AppProviders } from '../providers/app-providers';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}
```

**Tabs group** — `app/(tabs)/_layout.tsx`

```tsx
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="programs" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
```

---

## 📦 Redux — `state/store.ts` and slices

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth-slice';
import uiReducer from './slices/ui-slice';

export const store = configureStore({
  reducer: { auth: authReducer, ui: uiReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

`state/slices/auth-slice.ts`

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState { token?: string; isAuthenticated: boolean; user?: { id: string; name: string } }
const initialState: AuthState = { isAuthenticated: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | undefined>) {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setUser(state, action: PayloadAction<AuthState['user']>) {
      state.user = action.payload;
    },
    logout() { return initialState },
  },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
```

---

## 🔌 Storage Abstraction — `services/auth/auth-storage.ts`

```ts
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token_v1';

export async function setTokenSecure(value: string) {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, value);
}

export async function getTokenSecure() {
  if (Platform.OS === 'web') return localStorage.getItem(TOKEN_KEY) || undefined;
  return (await SecureStore.getItemAsync(TOKEN_KEY)) || undefined;
}

export async function clearTokenSecure() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
```

---

## 🌐 API Client — `services/api-client/index.ts`

```ts
import { env } from '../../config/env';
import { z } from 'zod';
import { getTokenSecure } from '../auth/auth-storage';

interface RequestOptions { method?: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'; body?: unknown; signal?: AbortSignal }

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const method = options.method || 'GET';
  const token = await getTokenSecure();

  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal || controller.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

// Example Zod schema usage
export const UserSchema = z.object({ id: z.string(), name: z.string() });
export type User = z.infer<typeof UserSchema>;
```

**Endpoints** — `services/api-client/endpoints.ts`

```ts
export const endpoints = {
  me: () => '/me',
  plans: {
    list: (page = 1) => `/plans?page=${page}`,
    byId: (id: string) => `/plans/${id}`,
  },
};
```

---

## 🧪 Query Hooks (TanStack) — example

```ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api-client';
import { endpoints } from '../services/api-client/endpoints';

interface Plan { id: string; name: string }

export function usePlans(page = 1) {
  return useQuery({
    queryKey: ['plans', page],
    queryFn: () => api<Plan[]>(endpoints.plans.list(page)),
    staleTime: 60_000,
  });
}
```

---

## 📡 Socket.IO — typed client (`services/socket/`)

`socket-events.ts`

```ts
// Use maps/string unions instead of enums
export interface ServerToClientEvents {
  'session:welcome': (payload: { message: string }) => void;
  'chat:message': (msg: { id: string; text: string; userId: string; at: string }) => void;
  'progress:update': (p: { userId: string; streak: number }) => void;
}

export interface ClientToServerEvents {
  'chat:send': (msg: { text: string }) => void;
  'presence:ping': () => void;
}
```

`socket-client.ts`

```ts
import { io, Socket } from 'socket.io-client';
import { env } from '../../config/env';
import type { ServerToClientEvents, ClientToServerEvents } from './socket-events';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined;

export function getSocket() {
  if (socket) return socket;
  socket = io(env.socketUrl, { transports: ['websocket'], autoConnect: false });
  return socket;
}

export function connectSocket(token?: string) {
  const s = getSocket();
  if (s.connected) return s;
  s.auth = token ? { token } : undefined;
  s.connect();
  return s;
}

export function disconnectSocket() { socket?.disconnect(); }
```

**Hook**

```ts
import { useEffect } from 'react';
import { connectSocket, getSocket } from './socket-client';

export function useSocket(token?: string) {
  useEffect(() => {
    const s = connectSocket(token);
    return () => { s.off(); s.disconnect(); };
  }, [token]);

  return getSocket();
}
```

---

## 🏠 Example Screen — `app/(tabs)/home/index.tsx`

```tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { usePlans } from '../../../hooks/use-plans';

export default function HomeScreen() {
  const { data: plans, isLoading } = usePlans();
  if (isLoading) return <Text className="text-text">Loading…</Text>;

  return (
    <ScrollView className="flex-1 bg-bg px-4 py-3">
      <Text className="text-text text-xl font-semibold mb-3">Dashboard</Text>
      <View className="gap-2">
        {plans?.map(p => (
          <View key={p.id} className="bg-card rounded-xl p-3 border border-border">
            <Text className="text-text">{p.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
```

---

## 📏 Domain Types — `types/domain.ts`

```ts
export interface Exercise { id: string; name: string; videoUrl?: string; reps?: number; sets?: number }
export interface Workout { id: string; day: number; title: string; exercises: Exercise[] }
export interface TrainingPlan { id: string; name: string; weeks: number; workouts: Workout[] }

export interface Recipe { id: string; title: string; calories: number; protein: number; carbs: number; fat: number }
export interface Meal { id: string; name: string; recipes: Recipe[] }
export interface NutritionPlan { id: string; name: string; meals: Meal[] }
```

---

## 🧩 Forms + Validation (Zod)

```ts
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof LoginSchema>;
```

---

## 🌍 i18n Setup

```ts
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import sr from './locales/sr.json';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: Localization.locale.startsWith('sr') ? 'sr' : 'en',
  fallbackLng: 'en',
  resources: { en: { translation: en }, sr: { translation: sr } },
  interpolation: { escapeValue: false },
});

export default i18n;
```

---

## 🛡 Error Boundary — `utils/error-boundary.tsx`

```tsx
import React from 'react';
import { Text, View } from 'react-native';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error?: Error }> {
  state = { error: undefined as Error | undefined };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return (
      <View className="flex-1 items-center justify-center bg-bg p-4">
        <Text className="text-text text-lg mb-2">Something went wrong</Text>
        <Text className="text-text text-sm">{this.state.error.message}</Text>
      </View>
    );
    return this.props.children;
  }
}
```

---

## 🧪 Testing (brief)

* **Jest** + **@testing-library/react-native** for components.
* **Detox** for e2e (login, open plan, start workout).
* Add minimal tests for API client (success + error).

---

## 🔐 Security Notes

* Always send tokens in `Authorization: Bearer` header.
* Never log PII in production.
* Validate all responses with Zod.
* Use OTA updates via `expo-updates`. Follow Expo Security guide.

---

## 🚀 Tasks for Sonnet 4 (do now)

1. Initialize Expo (managed) with TypeScript, NativeWind, expo-router, react-query, Redux Toolkit, socket.io-client, i18next.
2. Create all folders/files exactly as defined.
3. Implement `theme.ts`, NativeWind config, providers, and root/tab layouts.
4. Implement `api` wrapper, endpoints, Zod schemas; add `usePlans` example hook.
5. Implement `auth-storage` abstraction (SecureStore vs localStorage), basic auth slice and UI slice.
6. Implement typed Socket.IO client with `useSocket` and sample subscription in `chat/index.tsx`.
7. Add `i18n` with `en.json` and `sr.json` placeholders.
8. Add ESLint + Prettier configs, `tsconfig.json` with `strict: true`.
9. Add Jest config and one example test for a component and a hook.
10. Verify deep linking config in `config/linking.ts` and web compatibility.

---

## 🧭 Feature Mapping to Structure

* **Programs → Training Plans → Workouts → Exercises**: nested routes under `programs/training-plans/[planId]/workouts/...`
* **Programs → Nutrition Plans → Meals → Recipes**: nested routes under `programs/nutrition-plans/[planId]/meals/...`
* **Progress**: charts & streaks (use `react-native-svg`/`victory-native` or `recharts` on web-only fallback).
* **Chat**: Socket.IO room + optimistic messages.
* **Questionnaires**: list/active/completed with Zod‑validated forms.
* **Profile**: personal info, account settings, app preferences (units, notifications).

---

## 🔌 Example Socket usage in Chat Screen (sketch)

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useSocket } from '../../services/socket/socket-client';

export default function ChatScreen() {
  const socket = useSocket();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<{id:string;text:string}[]>([]);

  useEffect(() => {
    socket.on('session:welcome', () => {});
    socket.on('chat:message', m => setMessages(prev => [...prev, { id: m.id, text: m.text }]));
    return () => { socket.off('chat:message'); };
  }, [socket]);

  function send() {
    if (!text.trim()) return;
    socket.emit('chat:send', { text });
    setText('');
  }

  return (
    <View className="flex-1 bg-bg p-4">
      <View className="flex-1">
        {messages.map(m => <Text key={m.id} className="text-text mb-1">{m.text}</Text>)}
      </View>
      <View className="flex-row gap-2">
        <TextInput value={text} onChangeText={setText} className="flex-1 bg-card text-text p-3 rounded-xl" />
        <Button title="Send" onPress={send} />
      </View>
    </View>
  );
}
```

---

## 📚 Notes

* Use `expo-image` for images (`<Image source={{ uri }} contentFit="cover" transition={300} />`).
* Use `useWindowDimensions` for responsive changes; avoid magic numbers.
* Prefer `NativeWind` class names for rapid UI tweaks; theme tokens mirror Tailwind config.
* Keep **all colors** in `styles/theme.ts` and **mirror** in `tailwind.config.js`.

---

## ✅ Done Criteria

* App boots with tabs, providers wired, strict TS passing.
* `usePlans` fetch works against a mock or real endpoint.
* Socket connects (mock server OK) and chat screen receives/sends messages.
* Theme swap (light/dark) affects backgrounds/text/borders globally.
* Builds for native and web run without code changes.
