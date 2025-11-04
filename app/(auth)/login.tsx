import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { setToken, setUser } from '@/state/slices/auth-slice';
import { login } from '@/services/auth/auth-service';
import { getTokenSecure } from '@/services/auth/auth-storage';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { darkTheme } from '@/styles/theme';
import { MailIcon } from '@/components/icons/MailIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { AppleIcon } from '@/components/icons/AppleIcon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
  },
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftSide: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  leftSideGradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContent: {
    alignItems: 'center',
    gap: 24,
    maxWidth: 600,
  },
  logoCircle: {
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 128,
  },
  leftTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
  },
  leftSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontSize: 18,
  },
  rightSide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    paddingVertical: 48,
    backgroundColor: darkTheme.color.bg,
  },
  mobileContainer: {
    flex: 1,
  },
  mobileLogoSection: {
    alignItems: 'center',
    gap: 16, // gap-4 = 16px
    marginBottom: 32, // mb-8 = 32px
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  mobileLogo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: `${darkTheme.color.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileLogoImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  logoImage: {
    width: 256,
    height: 256,
  },
  logoImageAnimated: {
    width: 256,
    height: 256,
  },
  mobileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: darkTheme.color.primary,
    letterSpacing: 2,
  },
  formContainer: {
    width: '100%',
    maxWidth: 600,
    minWidth: 450,
    paddingHorizontal: 24,
  },
  welcomeSection: {
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 30, // text-3xl on mobile, text-4xl on desktop
    fontWeight: 'bold',
    color: darkTheme.color.foreground,
    marginBottom: 8, // space-y-2 = 8px
  },
  welcomeSubtitle: {
    color: darkTheme.color.mutedForeground,
    fontSize: 16,
  },
  form: {
    marginTop: 32, // space-y-8 = 32px
    gap: 24, // space-y-6 = 24px
  },
  formGroup: {
    gap: 8, // space-y-2 = 8px
    marginBottom: 24, // space-y-6 = 24px
  },
  errorText: {
    color: darkTheme.color.destructive,
    fontSize: 14,
    marginTop: 8,
  },
  dividerContainer: {
    position: 'relative',
    marginVertical: 32,
  },
  dividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: darkTheme.color.border,
  },
  dividerTextContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  dividerText: {
    paddingHorizontal: 16,
    backgroundColor: darkTheme.color.bg,
    color: darkTheme.color.mutedForeground,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    // Pulse animation
    pulseOpacity.value = withRepeat(
      withTiming(0.7, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    return () => {
      subscription?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
    };
  });

  const isTablet = screenData.width >= 768;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await login({ email: email.trim(), password });
      // Token is already saved in login() function via setTokenSecure
      // Verify token was saved before proceeding
      const savedToken = await getTokenSecure();
      
      if (!savedToken || savedToken !== response.token) {
        throw new Error('Failed to save authentication token. Please try again.');
      }
      
      // Now update Redux state
      console.log('Login: Dispatching user data', {
        hasRelationships: !!response.user.relationships,
        relationshipsCount: response.user.relationships?.length || 0,
        relationships: response.user.relationships
      });
      dispatch(setToken(response.token));
      dispatch(setUser(response.user));
      
      // Small delay to ensure state is persisted before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate after ensuring token is saved
      router.replace('/(protected)/(tabs)/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {isTablet ? (
            <View style={styles.desktopContainer}>
              {/* Left Side - Logo Section (Desktop/Tablet) */}
              <LinearGradient
                colors={[darkTheme.color.primary, darkTheme.color.accent, darkTheme.color.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.leftSideGradient}
              >
                <View style={styles.leftSide}>
                  <View style={styles.leftContent}>
                    <Animated.View style={[styles.logoImageAnimated, animatedImageStyle]}>
                      <Image
                        source={require('@/assets/images/fitness-logo.png')}
                        style={styles.logoImage}
                        contentFit="contain"
                      />
                    </Animated.View>
                    <Text style={styles.leftTitle}>FITNESS APP</Text>
                    <Text style={styles.leftSubtitle}>Transform your body, transform your life</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Right Side - Form Section */}
              <View style={styles.rightSide}>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.formContainer}>
                    {/* Welcome Text */}
                    <View style={styles.welcomeSection}>
                      <Text style={styles.welcomeTitle}>Welcome Back</Text>
                      <Text style={styles.welcomeSubtitle}>Enter your email and password</Text>
                    </View>

                    {/* Login Form */}
                    <View style={styles.form}>
                      <View style={styles.formGroup}>
                        <Label>Email</Label>
                        <Input
                          placeholder="Enter your email"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoComplete="email"
                          icon={<MailIcon />}
                        />
                      </View>

                      <View style={styles.formGroup}>
                        <Label>Password</Label>
                        <Input
                          placeholder="Enter your password"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                          autoCapitalize="none"
                          autoComplete="password"
                          icon={<LockIcon />}
                        />
                      </View>

                      {error && (
                        <Text style={styles.errorText}>{error}</Text>
                      )}

                      <Button
                        title="LOG IN"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        size="lg"
                      />
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                      <View style={styles.dividerLine} />
                      <View style={styles.dividerTextContainer}>
                        <Text style={styles.dividerText}>Or continue with</Text>
                      </View>
                    </View>

                    {/* Social Login */}
                    <View style={styles.socialButtons}>
                      <Button
                        variant="outline"
                        size="icon"
                        onPress={() => {}}
                        icon={<GoogleIcon size={20} />}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onPress={() => {}}
                        icon={<AppleIcon size={20} />}
                      />
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              style={styles.container}
            >
              {/* Mobile Logo Section */}
              <View style={styles.mobileLogoSection}>
                <Animated.View style={[styles.mobileLogo, animatedImageStyle]}>
                  <Image
                    source={require('@/assets/images/fitness-logo.png')}
                    style={styles.mobileLogoImage}
                    contentFit="contain"
                  />
                </Animated.View>
                <Text style={styles.mobileTitle}>FITNESS APP</Text>
              </View>

              {/* Form Section */}
              <View style={styles.rightSide}>
              <View style={styles.formContainer}>
                {/* Welcome Text */}
                <View style={styles.welcomeSection}>
                  <Text style={styles.welcomeTitle}>Welcome Back</Text>
                  <Text style={styles.welcomeSubtitle}>Enter your email and password</Text>
                </View>

                {/* Login Form */}
                <View style={styles.form}>
                  <View style={styles.formGroup}>
                    <Label>Email</Label>
                    <Input
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      icon={<MailIcon />}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Label>Password</Label>
                    <Input
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      autoCapitalize="none"
                      autoComplete="password"
                      icon={<LockIcon />}
                    />
                  </View>

                  {error && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}

                  <Button
                    title="LOG IN"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    size="lg"
                  />
                </View>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <View style={styles.dividerTextContainer}>
                    <Text style={styles.dividerText}>Or continue with</Text>
                  </View>
                </View>

                {/* Social Login */}
                <View style={styles.socialButtons}>
                  <Button
                    variant="outline"
                    size="icon"
                    onPress={() => {}}
                    icon={<GoogleIcon size={20} />}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onPress={() => {}}
                    icon={<AppleIcon size={20} />}
                  />
                </View>
              </View>
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

