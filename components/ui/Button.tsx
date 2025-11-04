import React from 'react';
import { Pressable, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import { darkTheme } from '@/styles/theme';

export interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  className = '',
  children,
  icon,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle: any = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    };

    // Variant styles
    switch (variant) {
      case 'default':
        baseStyle.backgroundColor = darkTheme.color.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = darkTheme.color.secondary;
        break;
      case 'outline':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = darkTheme.color.input;
        baseStyle.backgroundColor = darkTheme.color.bg;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'destructive':
        baseStyle.backgroundColor = darkTheme.color.destructive;
        break;
    }

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle.height = 36;
        baseStyle.paddingHorizontal = 12;
        baseStyle.paddingVertical = 8;
        break;
      case 'lg':
        baseStyle.height = 48; // h-12
        baseStyle.paddingHorizontal = 32;
        baseStyle.paddingVertical = 12;
        break;
      case 'icon':
        baseStyle.height = 48;
        baseStyle.width = 48;
        baseStyle.borderRadius = 24;
        break;
      default:
        baseStyle.height = 40;
        baseStyle.paddingHorizontal = 16;
        baseStyle.paddingVertical = 10;
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle: any = {
      fontWeight: '600',
    };

    switch (size) {
      case 'sm':
      case 'icon':
        baseStyle.fontSize = 14;
        break;
      case 'lg':
        baseStyle.fontSize = 18; // text-lg
        break;
      default:
        baseStyle.fontSize = 14;
    }

    switch (variant) {
      case 'default':
        baseStyle.color = darkTheme.color.primaryForeground;
        break;
      case 'secondary':
        baseStyle.color = darkTheme.color.secondaryForeground;
        break;
      case 'outline':
      case 'ghost':
        baseStyle.color = darkTheme.color.foreground;
        break;
      case 'destructive':
        baseStyle.color = darkTheme.color.destructiveForeground;
        break;
    }

    return baseStyle;
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' ? darkTheme.color.primary : darkTheme.color.primaryForeground} 
          size="small"
        />
      ) : (
        <>
          {icon && <View style={{ marginRight: title || children ? 8 : 0 }}>{icon}</View>}
          {children || <Text style={getTextStyle()}>{title}</Text>}
        </>
      )}
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        getButtonStyle(),
        pressed && !disabled && !loading && { opacity: 0.8 },
      ]}
    >
      {content}
    </Pressable>
  );
}

