import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-xl items-center justify-center';
  const variantClasses = {
    primary: 'bg-primary',
    secondary: 'bg-card border border-border',
    danger: 'bg-danger',
  };
  const textClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-text font-semibold',
    danger: 'text-white font-semibold',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#10b981' : '#ffffff'} />
      ) : (
        <Text className={textClasses[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

