import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimatedButton({
  title, onPress, variant = 'primary', loading, disabled,
  icon, style, fullWidth, size = 'md',
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';

  const sizeStyle = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
    md: { paddingVertical: spacing.md + 2, paddingHorizontal: spacing.xl },
    lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl },
  }[size];

  const textSize = {
    sm: typography.buttonSmall,
    md: typography.button,
    lg: { ...typography.button, fontSize: 18 },
  }[size];

  const content = (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
    >
      <Animated.View
        style={[
          styles.base,
          sizeStyle,
          isPrimary && styles.primary,
          isOutline && styles.outline,
          isSecondary && styles.secondary,
          isGhost && styles.ghost,
          animatedStyle,
          style,
        ]}
      >
        {isPrimary && (
          <LinearGradient
            colors={[colors.primaryLight, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {loading ? (
          <ActivityIndicator color={isPrimary ? colors.textInverse : colors.primary} />
        ) : (
          <>
            {icon && <Text style={[styles.icon, isPrimary && styles.textLight]}>{icon}</Text>}
            <Text
              style={[
                textSize,
                isPrimary && styles.textLight,
                isOutline && styles.textPrimary,
                isSecondary && styles.textPrimary,
                isGhost && styles.textPrimary,
                disabled && styles.textDisabled,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );

  return content;
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    overflow: 'hidden',
    ...shadows.sm,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primaryFaded,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    ...shadows.sm,
    shadowOpacity: 0,
    elevation: 0,
  },
  icon: {
    fontSize: 18,
  },
  textLight: {
    color: colors.textInverse,
  },
  textPrimary: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
