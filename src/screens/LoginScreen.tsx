import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, KeyboardAvoidingView,
  Platform, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { AnimatedButton } from '../components/AnimatedButton';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/types';

type LoginNavProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginNavProp;
}

export function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('DSR');
  const [password, setPassword] = useState('dsr123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await mockApi.auth.login(username, password);
      await login(user);
      navigation.navigate('BUSelection', { user });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.primaryDark, colors.primary, colors.primaryLight]}
        style={styles.gradient}
      >
        <View style={styles.topSection}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>◆</Text>
          </View>
          <Text style={styles.appName}> UI</Text>
          <Text style={styles.tagline}>Sales Force Automation</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.instruction}>Sign in to start your day</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <AnimatedButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          />

          <Text style={styles.hint}>
            Demo: DSR / dsr123
          </Text>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  topSection: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.huge,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoIcon: {
    fontSize: 40,
    color: colors.textInverse,
  },
  appName: {
    ...typography.h1,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  formSection: {
    flex: 0.6,
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.xxl,
    ...shadows.xl,
  },
  welcome: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  instruction: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xxl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  hint: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
