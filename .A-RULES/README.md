# TR20 Client - Expo Mobile Application

A production-grade Expo (managed workflow) mobile application for iOS, Android, and Web, built with TypeScript, NativeWind, Redux Toolkit, TanStack Query, and Socket.IO.

## 🚀 Features

- **Expo Router** for file-based navigation with deep linking support
- **NativeWind** (Tailwind CSS for React Native) for styling
- **Redux Toolkit** for global state management (auth, UI)
- **TanStack Query** for server state and data fetching
- **Socket.IO** client with typed events
- **Zod** for runtime validation
- **i18n** support (English and Serbian)
- **TypeScript** with strict mode enabled
- **Error boundaries** and comprehensive error handling
- **Secure storage** abstraction (SecureStore for native, localStorage for web)
- **Testing setup** with Jest and React Native Testing Library

## 📁 Project Structure

```
client2.0/
├── app/                       # Expo Router entry
│   ├── _layout.tsx            # Root layout with providers
│   ├── (tabs)/                # Tab navigator group
│   │   ├── _layout.tsx        # Tabs configuration
│   │   ├── home/              # Home tab
│   │   ├── programs/          # Programs tab
│   │   ├── progress/          # Progress tab
│   │   ├── chat/              # Chat tab
│   │   └── profile/           # Profile tab
│   └── questionnaires/        # Questionnaires screens
├── components/                # Reusable components
│   ├── common/                # Common UI components
│   └── forms/                 # Form components
├── config/                    # Configuration files
│   ├── env.ts                 # Environment variables
│   └── linking.ts             # Deep linking config
├── hooks/                     # Custom React hooks
│   ├── use-socket.ts          # Socket.IO hook
│   ├── use-plans.ts           # Data fetching hooks
│   ├── use-color-scheme.ts    # Theme hook
│   ├── use-online-status.ts   # Network status hook
│   └── use-app-focus.ts       # App focus hook
├── i18n/                      # Internationalization
│   ├── index.ts               # i18n setup
│   └── locales/               # Translation files
├── providers/                 # React context providers
│   └── app-providers.tsx      # All providers wrapper
├── services/                  # API and business logic
│   ├── api-client/            # API client with Zod
│   ├── auth/                  # Authentication service
│   └── socket/                # Socket.IO client
├── state/                     # Redux store
│   ├── store.ts               # Store configuration
│   └── slices/                # Redux slices
├── styles/                    # Theme and styling
│   ├── theme.ts               # Theme tokens
│   └── tailwind.config.js     # Tailwind configuration
├── types/                     # TypeScript types
│   ├── domain.ts              # Domain models
│   └── api.ts                 # API types
├── utils/                     # Utility functions
│   ├── error-boundary.tsx     # Error boundary component
│   ├── logger.ts              # Logging utility
│   └── zod-helpers.ts         # Zod helper functions
└── tests/                     # Test files
    └── unit/                  # Unit tests
```

## 🛠 Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Studio for emulator

### Installation

1. **Install dependencies:**

```bash
cd client2.0
npm install
```

2. **Configure environment variables:**

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
EXPO_PUBLIC_SENTRY_DSN=
```

3. **Start the development server:**

```bash
npm start
```

4. **Run on platform:**

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check
```

## 🎨 Styling

This project uses **NativeWind** (Tailwind CSS for React Native). All theme tokens are defined in `styles/theme.ts` and consumed by the Tailwind configuration.

### Theme Colors

- Primary: `#10b981` (emerald-500)
- Background: `#ffffff` (light) / `#0b1220` (dark)
- Text: `#0f172a` (light) / `#e5e7eb` (dark)

### Usage Example

```tsx
<View className="bg-card rounded-xl p-4 border border-border">
  <Text className="text-text font-semibold">Hello World</Text>
</View>
```

## 📡 API Integration

The API client is located in `services/api-client/` and uses:

- **Fetch API** with automatic token injection
- **Zod schemas** for response validation
- **Abort controllers** for request cancellation

### Example Usage

```typescript
import { api } from './services/api-client';
import { endpoints } from './services/api-client/endpoints';

const plans = await api<TrainingPlan[]>(endpoints.plans.list());
```

## 🔌 Socket.IO

The Socket.IO client is fully typed and located in `services/socket/`.

### Example Usage

```typescript
import { useSocket } from './hooks/use-socket';

const socket = useSocket(token);

socket.on('chat:message', msg => {
  console.log('New message:', msg);
});

socket.emit('chat:send', { text: 'Hello!' });
```

## 🌍 Internationalization

Supports English and Serbian with `i18next`.

### Usage

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <Text>{t('home.welcome')}</Text>;
```

## 🔐 Security

- Tokens stored securely using `expo-secure-store` (native) and `localStorage` (web)
- All API requests use HTTPS in production
- Input validation with Zod schemas
- No sensitive data logged in production

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ✅ Web

## 🏗 Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📝 Code Style

- **TypeScript** with strict mode
- **ESLint** for code quality
- **Prettier** for formatting
- Functional components with hooks
- Named exports preferred

### Naming Conventions

- Files: `kebab-case.ts`
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_CASE`

## 🤝 Contributing

1. Follow the code style guidelines
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before committing

## 📄 License

MIT License

## 🆘 Troubleshooting

### Metro bundler issues

```bash
npx expo start --clear
```

### iOS build issues

```bash
cd ios && pod install && cd ..
```

### Type errors

```bash
npm run type-check
```

### Network requests failing

Check that your API server is running and the `EXPO_PUBLIC_API_URL` is correct.

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/)

