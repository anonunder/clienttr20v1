import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { darkTheme } from '@/styles/theme';

interface LockIconProps {
  size?: number;
  color?: string;
}

export function LockIcon({ size = 20, color = darkTheme.color.mutedForeground }: LockIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 11h-1a2 2 0 0 0-2-2V7a4 4 0 0 0-8 0v2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 11V7a4 4 0 0 1 8 0v2"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

