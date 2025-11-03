/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{tsx,ts}',
    './components/**/*.{tsx,ts}',
    './providers/**/*.{tsx,ts}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
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
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};

