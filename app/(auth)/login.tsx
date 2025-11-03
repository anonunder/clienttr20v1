import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { setToken, setUser } from '@/state/slices/auth-slice';
import { login } from '@/services/auth/auth-service';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/common/Button';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await login({ email: email.trim(), password });
      dispatch(setToken(response.token));
      dispatch(setUser(response.user));
      // Router will automatically redirect due to middleware
      router.replace('/(protected)/(tabs)/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-1 justify-center px-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text className="text-text text-3xl font-bold mb-2">Welcome Back</Text>
            <Text className="text-textMuted text-base">Sign in to continue</Text>
          </View>

          <View className="gap-4 mb-6">
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={error && !email.trim() ? error : ''}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              error={error && !password.trim() ? error : ''}
            />

            {error && email.trim() && password.trim() && (
              <Text className="text-danger text-sm">{error}</Text>
            )}
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

