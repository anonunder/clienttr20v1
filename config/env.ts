import Constants from 'expo-constants';

interface EnvShape {
  apiBaseUrl: string;
  socketUrl: string;
  sentryDsn?: string;
}

export const env: EnvShape = {
  apiBaseUrl: (Constants?.expoConfig?.extra as { API_BASE_URL?: string })?.API_BASE_URL || '',
  socketUrl: (Constants?.expoConfig?.extra as { SOCKET_URL?: string })?.SOCKET_URL || '',
  sentryDsn: (Constants?.expoConfig?.extra as { SENTRY_DSN?: string })?.SENTRY_DSN,
};

export function assertEnv() {
  if (!env.apiBaseUrl) throw new Error('API_BASE_URL is required');
  if (!env.socketUrl) throw new Error('SOCKET_URL is required');
}

