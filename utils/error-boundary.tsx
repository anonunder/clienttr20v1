import React from 'react';
import { Text, View } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: undefined };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <View className="flex-1 items-center justify-center bg-bg p-4">
          <Text className="text-text text-lg mb-2 font-semibold">Something went wrong</Text>
          <Text className="text-textMuted text-sm text-center">
            {this.state.error.message || 'An unexpected error occurred'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

