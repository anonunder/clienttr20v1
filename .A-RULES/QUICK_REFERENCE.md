# TR20 Client - Quick Reference

## 🚀 Common Commands

```bash
# Development
npm start                    # Start development server
npm run ios                  # Run on iOS simulator
npm run android              # Run on Android emulator
npm run web                  # Run in browser

# Code Quality
npm run lint                 # Run ESLint
npm run format               # Format with Prettier
npm run type-check           # TypeScript check
npm test                     # Run tests
npm run test:watch           # Run tests in watch mode

# Utilities
npx expo start --clear       # Clear cache and start
./scripts/setup.sh           # Run setup script
```

## 📁 Where to Find Things

```
Need to...                          Look in...
─────────────────────────────────────────────────────────────
Add a new screen                    app/[route].tsx
Add a tab                           app/(tabs)/[name]/index.tsx
Create a component                  components/[category]/[Name].tsx
Add an API endpoint                 services/api-client/endpoints.ts
Add a Zod schema                    services/api-client/zod-schemas.ts
Add Redux state                     state/slices/[name]-slice.ts
Create a custom hook                hooks/use-[name].ts
Add a translation                   i18n/locales/[lang].json
Add a Socket.IO event               services/socket/socket-events.ts
Define a type                       types/domain.ts or types/api.ts
Add a color/theme token             styles/theme.ts
```

## 🎨 Styling Patterns

```tsx
// Card with border
<View className="bg-card rounded-xl p-4 border border-border">

// Primary button style
<View className="bg-primary rounded-xl px-6 py-3">

// Text styles
<Text className="text-text text-lg font-semibold">
<Text className="text-textMuted text-sm">

// Layout
<View className="flex-1 px-4 py-3">
<View className="flex-row gap-2 items-center">

// Conditional styling
<View className={`base-class ${condition ? 'active' : 'inactive'}`}>
```

## 🔌 API Client Usage

```typescript
// Simple GET
import { api } from '@/services/api-client';
import { endpoints } from '@/services/api-client/endpoints';

const data = await api<DataType>(endpoints.resource.list());

// POST with body
const result = await api<Result>(endpoints.resource.create(), {
  method: 'POST',
  body: { name: 'value' },
});

// With TanStack Query
import { useQuery } from '@tanstack/react-query';

export function useResource() {
  return useQuery({
    queryKey: ['resource'],
    queryFn: () => api<Resource[]>(endpoints.resource.list()),
    staleTime: 60_000,
  });
}
```

## 📡 Socket.IO Usage

```typescript
// In a component
import { useSocket } from '@/hooks/use-socket';

const socket = useSocket(token);

useEffect(() => {
  socket.on('event:name', (data) => {
    console.log('Received:', data);
  });

  return () => {
    socket.off('event:name');
  };
}, [socket]);

// Emit event
socket.emit('event:send', { data: 'value' });
```

## 🏪 Redux Usage

```typescript
// In a component
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { setToken, logout } from '@/state/slices/auth-slice';

const token = useSelector((state: RootState) => state.auth.token);
const dispatch = useDispatch();

// Update state
dispatch(setToken('new-token'));
dispatch(logout());
```

## 🌍 Translation Usage

```typescript
// In a component
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

return (
  <Text>{t('home.welcome')}</Text>
  <Text>{t('common.loading')}</Text>
);

// With variables
<Text>{t('user.greeting', { name: user.name })}</Text>
```

## 🎣 Custom Hooks Pattern

```typescript
// Create hook in hooks/use-[name].ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api-client';

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => api<Resource>(`/resources/${id}`),
    enabled: !!id,
  });
}

// Use in component
const { data, isLoading, error } = useResource(resourceId);
```

## 🧩 Component Pattern

```typescript
// components/[category]/[Name].tsx
import React from 'react';
import { View, Text } from 'react-native';

interface ComponentNameProps {
  title: string;
  onPress?: () => void;
}

export function ComponentName({ title, onPress }: ComponentNameProps) {
  return (
    <View className="bg-card rounded-xl p-4">
      <Text className="text-text font-semibold">{title}</Text>
    </View>
  );
}
```

## 📱 Screen Pattern

```typescript
// app/[route]/index.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function ScreenName() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4 py-3">
        <Text className="text-text text-2xl font-bold mb-4">
          {t('screen.title')}
        </Text>
        
        {/* Content */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

## 🔐 Auth Patterns

```typescript
// Login
import { login } from '@/services/auth/auth-service';
import { setToken, setUser } from '@/state/slices/auth-slice';

const response = await login({ email, password });
dispatch(setToken(response.token));
dispatch(setUser(response.user));

// Logout
import { logout as authLogout } from '@/services/auth/auth-service';
import { logout } from '@/state/slices/auth-slice';

await authLogout();
dispatch(logout());

// Check if authenticated
const isAuthenticated = useSelector(
  (state: RootState) => state.auth.isAuthenticated
);
```

## 🧪 Testing Patterns

```typescript
// Component test
import { render } from '@testing-library/react-native';
import { Component } from '@/components/common/Component';

describe('Component', () => {
  it('should render', () => {
    const { getByText } = render(<Component title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });
});

// Redux test
import { configureStore } from '@reduxjs/toolkit';
import reducer, { action } from '@/state/slices/slice';

describe('slice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({ reducer: { slice: reducer } });
  });

  it('should handle action', () => {
    store.dispatch(action('value'));
    expect(store.getState().slice.property).toBe('value');
  });
});
```

## 🎯 Navigation Patterns

```typescript
// Navigate programmatically
import { router } from 'expo-router';

router.push('/screen');
router.replace('/screen');
router.back();

// With parameters
router.push({
  pathname: '/screen/[id]',
  params: { id: '123' },
});

// Get params in screen
import { useLocalSearchParams } from 'expo-router';

const { id } = useLocalSearchParams<{ id: string }>();
```

## 🎨 Theme Access

```typescript
// In TypeScript
import { lightTheme, darkTheme } from '@/styles/theme';

const theme = isDark ? darkTheme : lightTheme;
const color = theme.color.primary;

// Use with color scheme hook
import { useColorScheme } from '@/hooks/use-color-scheme';

const colorScheme = useColorScheme();
const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
```

## 🔍 Common Issues & Solutions

```bash
# Cache issues
npx expo start --clear

# Module not found
rm -rf node_modules && npm install

# Type errors
npm run type-check

# Port in use
npx expo start --port 8082

# iOS build issues
cd ios && pod install && cd ..

# Android build issues
cd android && ./gradlew clean && cd ..
```

## 📝 Code Style Rules

```typescript
// ✅ DO
export function ComponentName() { }
const [state, setState] = useState<Type>();
interface Props { }
async function fetchData() { }

// ❌ DON'T
export default class ComponentName { }
const [state, setState] = useState();  // No type
type Props = { }  // Use interface
function fetchData() { }  // Should be async
```

## 🔗 Useful Links

- [Expo Docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Zod](https://zod.dev/)

## 💡 Pro Tips

1. **Hot Reload**: Press `r` in terminal to reload, `Cmd+D` (iOS) or `Cmd+M` (Android) for dev menu
2. **Debugging**: Use React DevTools browser extension
3. **Performance**: Use `React.memo()` for expensive components
4. **Images**: Always specify width/height for better performance
5. **Lists**: Use `FlatList` for long lists, not `ScrollView`
6. **Keyboard**: Use `KeyboardAvoidingView` for forms
7. **Safe Area**: Always use `SafeAreaView` from react-native-safe-area-context
8. **Validation**: Always validate API responses with Zod
9. **Error Handling**: Use try/catch and error boundaries
10. **Types**: Never use `any`, use `unknown` if type is truly unknown

