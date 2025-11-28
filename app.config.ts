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
    infoPlist: {
      NSCameraUsageDescription: 'This app uses the camera to record exercise videos.',
      NSMicrophoneUsageDescription: 'This app uses the microphone to record audio for videos.',
      NSPhotoLibraryUsageDescription: 'This app accesses your photo library to select exercise images and videos.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#10b981',
    },
    package: 'com.tr20.client',
    permissions: [
      'CAMERA',
      'RECORD_AUDIO',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
  },
  web: {
    bundler: 'metro',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      'expo-av',
      {
        microphonePermission: 'Allow TR20 to access your microphone to record exercise videos.',
      },
    ],
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

