export interface AppTheme {
  color: {
    primary: string;
    primary600: string;
    primary700: string;
    bg: string;
    bgMuted: string;
    card: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    danger: string;
  };
  radius: { sm: number; md: number; lg: number; xl: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
}

export const lightTheme: AppTheme = {
  color: {
    primary: '#10b981',
    primary600: '#059669',
    primary700: '#047857',
    bg: '#ffffff',
    bgMuted: '#f6f7f9',
    card: '#ffffff',
    text: '#0f172a',
    textMuted: '#475569',
    border: '#e5e7eb',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  radius: { sm: 6, md: 10, lg: 14, xl: 20 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
};

export const darkTheme: AppTheme = {
  ...lightTheme,
  color: {
    ...lightTheme.color,
    bg: '#0b1220',
    bgMuted: '#111827',
    card: '#0f172a',
    text: '#e5e7eb',
    textMuted: '#94a3b8',
    border: '#1f2937',
  },
};

