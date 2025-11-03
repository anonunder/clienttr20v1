import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppFocus() {
  const [isFocused, setIsFocused] = useState(AppState.currentState === 'active');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      setIsFocused(nextAppState === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return isFocused;
}

