# TR20 Client - Setup & Development Guide

This guide will help you get the Expo mobile application up and running.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Git**

### For Mobile Development:

- **iOS**: Xcode (Mac only) or use Expo Go app
- **Android**: Android Studio or use Expo Go app

### For Web Development:

- Any modern web browser

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd client2.0
npm install
```

This will install all required dependencies including:
- Expo SDK
- React Navigation (expo-router)
- NativeWind (Tailwind CSS)
- Redux Toolkit
- TanStack Query
- Socket.IO client
- And more...

### 2. Environment Configuration

Create a `.env` file in the `client2.0` directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
EXPO_PUBLIC_SENTRY_DSN=
```

**Important Notes:**
- For iOS simulator, use `http://localhost:3000`
- For Android emulator, use `http://10.0.2.2:3000`
- For physical devices, use your computer's IP address (e.g., `http://192.168.1.100:3000`)

### 3. Start Development Server

```bash
npm start
```

This will start the Metro bundler. You'll see a QR code and several options:

- Press `i` - Open iOS simulator
- Press `a` - Open Android emulator
- Press `w` - Open in web browser
- Scan QR code with Expo Go app (mobile)

## 📱 Running on Devices

### iOS (Mac only)

**Using Simulator:**
```bash
npm run ios
```

**Using Physical Device:**
1. Install Expo Go from App Store
2. Scan QR code from terminal
3. App will load on your device

### Android

**Using Emulator:**
```bash
npm run android
```

**Using Physical Device:**
1. Install Expo Go from Play Store
2. Enable developer mode on your device
3. Scan QR code from terminal

### Web

```bash
npm run web
```

The app will open in your default browser at `http://localhost:8081`.

## 🛠 Development Workflow

### Project Structure

```
client2.0/
├── app/                    # Expo Router screens
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── services/               # API & Socket.IO clients
├── state/                  # Redux store
├── styles/                 # Theme & Tailwind config
├── types/                  # TypeScript definitions
├── utils/                  # Helper functions
└── i18n/                   # Translations
```

### Key Files to Know

- `app/_layout.tsx` - Root layout with providers
- `app/(tabs)/_layout.tsx` - Bottom tab navigation
- `state/store.ts` - Redux store configuration
- `services/api-client/index.ts` - API client
- `services/socket/socket-client.ts` - Socket.IO setup
- `styles/theme.ts` - Theme colors and tokens

### Adding a New Screen

1. Create a new file in the `app/` directory
2. Export a default React component
3. The route is automatically created based on the file path

Example: `app/settings.tsx` → `/settings`

### Adding a New API Endpoint

1. Add endpoint to `services/api-client/endpoints.ts`
2. Create Zod schema in `services/api-client/zod-schemas.ts`
3. Create a custom hook in `hooks/` using TanStack Query

### Styling Components

Use NativeWind (Tailwind) classes:

```tsx
<View className="bg-card rounded-xl p-4 border border-border">
  <Text className="text-text font-semibold">Hello</Text>
</View>
```

Available theme colors:
- `bg`, `bgMuted`, `card`
- `text`, `textMuted`
- `primary`, `primary600`, `primary700`
- `border`
- `success`, `warning`, `danger`

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

## 🔧 Troubleshooting

### Clear Cache

If you encounter build issues:

```bash
npx expo start --clear
```

### Reset Project

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Port Already in Use

Metro bundler uses port 8081. If it's in use:

```bash
npx expo start --port 8082
```

### iOS Simulator Issues

```bash
xcrun simctl erase all
```

### Android Emulator Issues

1. Open Android Studio
2. Go to AVD Manager
3. Wipe data on your virtual device
4. Restart emulator

### Cannot Connect to Server

**Check your API server is running:**
```bash
# In server directory
npm start
```

**Verify environment variables:**
```bash
cat .env
```

**For Android emulator, use:**
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
EXPO_PUBLIC_SOCKET_URL=http://10.0.2.2:3000
```

**For physical devices, use your computer's local IP:**
```bash
# Get your IP (Mac/Linux)
ifconfig | grep "inet "

# Use in .env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

## 🏗 Building for Production

### Prerequisites

Install EAS CLI:
```bash
npm install -g eas-cli
```

Login to Expo:
```bash
eas login
```

### Configure EAS

```bash
eas build:configure
```

### Build for iOS

```bash
eas build --platform ios
```

### Build for Android

```bash
eas build --platform android
```

### Submit to App Stores

```bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
```

## 🌍 Internationalization

The app supports English and Serbian out of the box.

### Add a New Language

1. Create `i18n/locales/[lang].json`
2. Copy structure from `en.json`
3. Translate all keys
4. Import in `i18n/index.ts`

### Using Translations

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
return <Text>{t('home.welcome')}</Text>;
```

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Navigation](https://reactnavigation.org/)

## 🤝 Getting Help

- Check the [README.md](./README.md) for project overview
- Review the [build.md](./build.md) for architecture details
- Search existing issues in the repository
- Ask in project chat/Slack channel

## 📝 Development Tips

1. **Hot Reload**: Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu
2. **Performance**: Use React DevTools and Flipper for debugging
3. **Network**: Use Reactotron to monitor API calls
4. **State**: Install Redux DevTools for state inspection
5. **Console**: Use `logger.info()` instead of `console.log()` for better control

## ✅ Next Steps

After setup:

1. ✅ Run the app on at least one platform
2. ✅ Verify API connectivity
3. ✅ Test Socket.IO connection in chat screen
4. ✅ Review the code structure
5. ✅ Run tests to ensure everything works
6. ✅ Start building your features!

Happy coding! 🎉

