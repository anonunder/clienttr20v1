import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'TR20',
  slug: 'tr20-client',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'tr20',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#10b981',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.tr20.client',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#10b981',
    },
    package: 'com.tr20.client',
  },
  web: {
    bundler: 'metro',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-build-properties',
      {
        ios: {
          newArchEnabled: false,
        },
        android: {
          newArchEnabled: false,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000',
    SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
    eas: {
      projectId: 'YOUR-EAS-ID',
    },
  },
  updates: {
    url: 'https://u.expo.dev/YOUR-EAS-ID',
  },
});

