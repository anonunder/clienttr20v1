# TR20 Client - Architecture Documentation

## 🏗 System Architecture

This document describes the architectural decisions and patterns used in the TR20 mobile application.

## 📐 Architecture Patterns

### 1. Feature-Based Folder Structure

The project uses a hybrid approach:
- **Screens** organized by route in `app/` (Expo Router convention)
- **Shared code** organized by type in root folders (services, hooks, components)
- **Domain logic** separated from UI

### 2. State Management Strategy

#### Redux Toolkit (Global State)
- **Auth state**: token, user, authentication status
- **UI state**: theme, loading states, notifications

#### TanStack Query (Server State)
- All API data fetching
- Automatic caching and background refetching
- Optimistic updates
- Query invalidation

#### Local State
- Form inputs
- UI toggles
- Component-specific state

### 3. Data Flow

```
┌─────────────┐
│   User UI   │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Component  │ ──> useQuery/useMutation (TanStack)
└──────┬──────┘        │
       │               v
       │        ┌──────────────┐
       │        │ API Client   │
       │        └──────┬───────┘
       │               │
       v               v
┌─────────────┐  ┌──────────────┐
│Redux Store  │  │   Backend    │
└─────────────┘  └──────────────┘
       │
       v
┌─────────────┐
│ Secure      │
│ Storage     │
└─────────────┘
```

## 🔌 Service Layer

### API Client (`services/api-client/`)

**Responsibilities:**
- HTTP request/response handling
- Token injection
- Error handling
- Response validation (Zod)

**Key Features:**
- Automatic token refresh
- Request cancellation with AbortController
- Type-safe endpoints
- Centralized error handling

### Socket.IO Client (`services/socket/`)

**Responsibilities:**
- Real-time communication
- Event handling
- Connection management

**Key Features:**
- Typed events (TypeScript)
- Auto-reconnection
- Token-based authentication
- Room/namespace support

### Auth Service (`services/auth/`)

**Responsibilities:**
- Login/logout
- Token management
- User session

**Key Features:**
- Platform-agnostic storage (SecureStore/localStorage)
- Token refresh logic
- Auto-login on app start

## 🎣 Hooks Layer

Custom hooks provide reusable logic:

### Data Hooks
- `usePlans()` - Fetch training plans
- `usePlanById(id)` - Fetch single plan
- Custom hooks for each domain entity

### System Hooks
- `useSocket()` - Socket.IO connection
- `useColorScheme()` - Theme management
- `useOnlineStatus()` - Network status
- `useAppFocus()` - App lifecycle

## 🎨 UI Layer

### Component Hierarchy

```
App
├── AppProviders (Redux, Query, SafeArea, Gesture)
│   ├── ErrorBoundary
│   │   └── ExpoRouter
│   │       ├── RootLayout
│   │       │   └── Tabs
│   │       │       ├── HomeScreen
│   │       │       ├── ProgramsScreen
│   │       │       ├── ProgressScreen
│   │       │       ├── ChatScreen
│   │       │       └── ProfileScreen
│   │       └── Other Routes
```

### Styling Strategy

**NativeWind (Tailwind CSS)**
- Utility-first CSS
- Consistent spacing/colors
- Dark mode support
- Responsive design

**Theme System**
- Single source of truth: `styles/theme.ts`
- Light/dark theme variants
- Platform-agnostic tokens

## 🔐 Security Architecture

### Token Management

1. **Storage**:
   - Native: `expo-secure-store` (encrypted)
   - Web: `localStorage` (secure context only)

2. **Transport**:
   - HTTPS only in production
   - Bearer token in Authorization header

3. **Refresh**:
   - Automatic token refresh on 401
   - Retry failed requests after refresh

### Data Validation

- **Runtime**: Zod schemas validate all API responses
- **Compile-time**: TypeScript ensures type safety
- **Input sanitization**: All user inputs validated

## 📡 Network Layer

### HTTP Requests

```typescript
api<T>(path, options) → Promise<T>
  ↓
  fetch() with token
  ↓
  Response validation (Zod)
  ↓
  Error handling
  ↓
  Return typed data
```

### Real-time Communication

```typescript
Socket.IO
  ↓
  Connect with token
  ↓
  Subscribe to events
  ↓
  Emit typed events
  ↓
  Handle responses
```

## 🧪 Testing Strategy

### Unit Tests
- Redux slices
- Utility functions
- Custom hooks (with React Hooks Testing Library)
- Pure functions

### Component Tests
- React Native Testing Library
- User interaction simulation
- Snapshot testing for complex UI

### Integration Tests
- API client with mock server
- Navigation flows
- State management flows

### E2E Tests (Detox)
- Critical user journeys
- Authentication flow
- Main feature flows

## 🚀 Performance Optimizations

### Code Splitting
- Lazy load screens with `React.lazy()`
- Dynamic imports for heavy dependencies

### Memoization
- `React.memo()` for expensive components
- `useMemo()` for computed values
- `useCallback()` for callbacks

### Image Optimization
- `expo-image` with lazy loading
- Proper image sizing
- WebP format where supported

### List Virtualization
- `FlatList` for long lists
- `windowSize` optimization
- `getItemLayout` for fixed-size items

### Query Optimization
- Stale time configuration
- Background refetching
- Cache invalidation strategy

## 🔄 Navigation Architecture

### Expo Router (File-based)

```
app/
├── _layout.tsx              → Root layout
├── (tabs)/
│   ├── _layout.tsx          → Tab navigator
│   ├── home/index.tsx       → /home
│   ├── programs/index.tsx   → /programs
│   └── ...
└── questionnaires/
    ├── index.tsx            → /questionnaires
    ├── active.tsx           → /questionnaires/active
    └── completed.tsx        → /questionnaires/completed
```

### Deep Linking

- Universal links for web/mobile
- Custom URL scheme: `tr20://`
- Configured in `config/linking.ts`

## 🌍 Internationalization

### i18n Architecture

```
i18n/
├── index.ts                 # i18n setup
└── locales/
    ├── en.json              # English
    └── sr.json              # Serbian
```

### Usage Pattern

```typescript
const { t } = useTranslation();
<Text>{t('namespace.key')}</Text>
```

### RTL Support
- Automatic layout flip
- RTL-aware components
- Locale-based direction

## 📦 Dependency Management

### Core Dependencies

| Package | Purpose | Why |
|---------|---------|-----|
| expo | Platform framework | Managed workflow, OTA updates |
| expo-router | Navigation | File-based, type-safe |
| nativewind | Styling | Tailwind CSS for RN |
| @reduxjs/toolkit | State management | Redux with less boilerplate |
| @tanstack/react-query | Server state | Caching, auto-refetch |
| socket.io-client | Real-time | Bidirectional communication |
| zod | Validation | Runtime type checking |
| i18next | i18n | Localization |

## 🔧 Build & Deploy

### Development
- Metro bundler
- Fast Refresh
- Source maps

### Production
- EAS Build for native apps
- Web build with optimized bundle
- OTA updates with Expo Updates

## 🎯 Design Principles

1. **Separation of Concerns**: UI, business logic, data fetching are separate
2. **Type Safety**: TypeScript strict mode everywhere
3. **Single Source of Truth**: Redux for global state, Query for server state
4. **Composition over Inheritance**: Functional components, custom hooks
5. **Error Boundaries**: Graceful error handling at every level
6. **Platform Agnostic**: Write once, run on iOS/Android/Web

## 📈 Scalability Considerations

### Horizontal Scalability
- Modular architecture allows team scaling
- Feature-based organization
- Clear boundaries between modules

### Vertical Scalability
- Optimistic updates for better UX
- Background sync
- Offline support (future)
- Performance monitoring (Sentry)

### Code Organization
- Consistent naming conventions
- Clear file structure
- Documented APIs
- Reusable components

## 🔮 Future Enhancements

1. **Offline Support**: Redux Persist + background sync
2. **Push Notifications**: Expo Notifications
3. **Analytics**: Segment or Amplitude
4. **A/B Testing**: Feature flags
5. **Advanced Animations**: Reanimated 3
6. **Video Streaming**: Custom player with HLS
7. **Biometric Auth**: Face ID / Fingerprint

## 📚 References

- [Expo Documentation](https://docs.expo.dev/)
- [Redux Toolkit Best Practices](https://redux-toolkit.js.org/usage/usage-guide)
- [TanStack Query Patterns](https://tanstack.com/query/latest/docs/react/overview)
- [React Native Performance](https://reactnative.dev/docs/performance)

