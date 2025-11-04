import React from 'react';
import { View, Text } from 'react-native';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold';
  
  const variantClasses = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    destructive: 'border-transparent bg-destructive text-destructive-foreground',
    outline: 'text-foreground border-border',
  };

  return (
    <View className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <Text className={`text-xs font-semibold ${
        variant === 'outline' ? 'text-foreground' : 
        variant === 'default' ? 'text-primary-foreground' :
        variant === 'secondary' ? 'text-secondary-foreground' :
        'text-destructive-foreground'
      }`}>
        {children}
      </Text>
    </View>
  );
}

