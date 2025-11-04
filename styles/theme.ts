export interface AppTheme {
  color: {
    primary: string;
    primary600: string;
    primary700: string;
    primaryForeground: string;
    bg: string;
    bgMuted: string;
    card: string;
    cardForeground: string;
    text: string;
    textMuted: string;
    foreground: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    success: string;
    warning: string;
    info: string;
    danger: string;
    destructive: string;
    destructiveForeground: string;
    popover: string;
    popoverForeground: string;
    overlay: string;
    surface: string;
    onSurface: string;
    onSurfaceVariant: string;
  };
  radius: { sm: number; md: number; lg: number; xl: number };
  spacing: { xs: number; sm: number; md: number; lg: number; xl: number };
}

// Lovable Design System Colors (converted from HSL to hex)
// Base dark theme matching Lovable design
export const darkTheme: AppTheme = {
  color: {
    // Primary colors (hsl(158 100% 53%) - cyan-green)
    primary: '#3EE9A8', // hsl(158 100% 53%)
    primary600: '#2BD695', // darker variant
    primary700: '#1FC381', // darker variant
    primaryForeground: '#0D1117', // hsl(220 20% 8%)
    
    // Background colors
    bg: '#0D1117', // hsl(220 20% 8%)
    bgMuted: '#161B22', // hsl(220 18% 10%)
    surface: '#141920', // hsl(220 18% 8%)
    
    // Card colors
    card: '#161B22', // hsl(220 18% 10%)
    cardForeground: '#F2F2F2', // hsl(0 0% 95%)
    
    // Text colors
    text: '#F2F2F2', // hsl(0 0% 95%)
    foreground: '#F2F2F2', // hsl(0 0% 95%)
    textMuted: '#999999', // hsl(0 0% 60%)
    mutedForeground: '#999999', // hsl(0 0% 60%)
    
    // Border and input
    border: '#30363D', // hsl(220 15% 20%)
    input: '#21262D', // hsl(220 15% 18%)
    ring: '#3EE9A8', // hsl(158 100% 53%)
    
    // Secondary colors
    secondary: '#1C2128', // hsl(220 15% 15%)
    secondaryForeground: '#F2F2F2', // hsl(0 0% 95%)
    
    // Accent colors
    accent: '#2F7CE8', // hsl(210 100% 55%)
    accentForeground: '#0D1117', // hsl(220 20% 8%)
    
    // Status colors
    success: '#3EE9A8', // hsl(158 100% 53%)
    warning: '#E6A800', // hsl(38 92% 50%)
    info: '#2F7CE8', // hsl(210 100% 55%)
    danger: '#E63946', // hsl(0 72% 51%)
    destructive: '#E63946', // hsl(0 72% 51%)
    destructiveForeground: '#FAFAFA', // hsl(0 0% 98%)
    
    // Popover
    popover: '#1C2128', // hsl(220 18% 12%)
    popoverForeground: '#F2F2F2', // hsl(0 0% 95%)
    
    // Additional
    overlay: '#000000', // hsl(0 0% 0%)
    onSurface: '#FFFFFF', // hsl(0 0% 100%)
    onSurfaceVariant: '#FFFFFF', // hsl(0 0% 100%)
  },
  radius: { sm: 6, md: 10, lg: 14, xl: 20 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
};

// Light theme (keeping for compatibility, but app primarily uses dark theme)
export const lightTheme: AppTheme = {
  color: {
    // Primary colors
    primary: '#3EE9A8',
    primary600: '#2BD695',
    primary700: '#1FC381',
    primaryForeground: '#0D1117',
    
    // Background colors
    bg: '#FFFFFF',
    bgMuted: '#F6F7F9',
    surface: '#FAFAFA',
    
    // Card colors
    card: '#FFFFFF',
    cardForeground: '#0F172A',
    
    // Text colors
    text: '#0F172A',
    foreground: '#0F172A',
    textMuted: '#475569',
    mutedForeground: '#475569',
    
    // Border and input
    border: '#E5E7EB',
    input: '#F6F7F9',
    ring: '#3EE9A8',
    
    // Secondary colors
    secondary: '#F1F5F9',
    secondaryForeground: '#0F172A',
    
    // Accent colors
    accent: '#2F7CE8',
    accentForeground: '#FFFFFF',
    
    // Status colors
    success: '#22C55E',
    warning: '#F59E0B',
    info: '#2F7CE8',
    danger: '#EF4444',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    
    // Popover
    popover: '#FFFFFF',
    popoverForeground: '#0F172A',
    
    // Additional
    overlay: '#000000',
    onSurface: '#000000',
    onSurfaceVariant: '#475569',
  },
  radius: { sm: 6, md: 10, lg: 14, xl: 20 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
};

