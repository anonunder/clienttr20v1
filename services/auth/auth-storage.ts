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
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY) || undefined;
  }
  return (await SecureStore.getItemAsync(TOKEN_KEY)) || undefined;
}

export async function clearTokenSecure() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

