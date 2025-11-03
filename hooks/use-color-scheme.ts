import { useColorScheme as useRNColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../state/store';

export function useColorScheme() {
  const systemScheme = useRNColorScheme();
  const themePreference = useSelector((state: RootState) => state.ui.theme);

  if (themePreference === 'auto') {
    return systemScheme || 'light';
  }

  return themePreference;
}

