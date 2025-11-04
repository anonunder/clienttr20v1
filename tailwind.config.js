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
        // Primary colors (Lovable design system)
        primary: '#3EE9A8',
        primary600: '#2BD695',
        primary700: '#1FC381',
        'primary-foreground': '#0D1117',
        
        // Background colors
        bg: '#0D1117',
        bgMuted: '#161B22',
        background: '#0D1117',
        surface: '#141920',
        
        // Card colors
        card: '#161B22',
        'card-foreground': '#F2F2F2',
        
        // Text colors
        text: '#F2F2F2',
        foreground: '#F2F2F2',
        textMuted: '#999999',
        'muted-foreground': '#999999',
        
        // Border and input
        border: '#30363D',
        input: '#21262D',
        ring: '#3EE9A8',
        
        // Secondary colors
        secondary: '#1C2128',
        'secondary-foreground': '#F2F2F2',
        
        // Accent colors
        accent: '#2F7CE8',
        'accent-foreground': '#0D1117',
        
        // Status colors
        success: '#3EE9A8',
        warning: '#E6A800',
        info: '#2F7CE8',
        danger: '#E63946',
        destructive: '#E63946',
        'destructive-foreground': '#FAFAFA',
        
        // Popover
        popover: '#1C2128',
        'popover-foreground': '#F2F2F2',
        
        // Additional
        overlay: '#000000',
        'on-surface': '#FFFFFF',
        'on-surface-variant': '#FFFFFF',
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

