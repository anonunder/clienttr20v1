import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

/**
 * Responsive breakpoints interface
 */
export interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

/**
 * Breakpoint values matching the codebase patterns
 * Mobile: < 640
 * Tablet: 640-1023
 * Desktop: >= 1024
 */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
} as const;

/**
 * Hook to get responsive breakpoints and window dimensions
 * Consolidates repeated Dimensions.get('window').width logic across components
 * 
 * @returns ResponsiveBreakpoints object with boolean flags and dimensions
 * 
 * @example
 * const { isMobile, isTablet, isDesktop, width } = useResponsive();
 * if (isTablet) {
 *   // Tablet-specific logic
 * }
 */
export function useResponsive(): ResponsiveBreakpoints {
  const [dimensions, setDimensions] = useState<ScaledSize>(
    Dimensions.get('window')
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const { width, height } = dimensions;

  return {
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop,
    width,
    height,
  };
}

