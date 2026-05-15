import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, shadows } from '../theme';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  animate?: boolean;
  delay?: number;
}

export function GlassCard({ children, style, gradient, animate, delay = 0 }: GlassCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        opacity.value = withTiming(1, { duration: 400 });
        translateY.value = withTiming(0, { duration: 400 });
      }, delay);
      return () => clearTimeout(timer);
    } else {
      opacity.value = 1;
      translateY.value = 0;
    }
  }, [animate, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const content = (
    <View style={[styles.card, style]}>
      {gradient && (
        <LinearGradient
          colors={[colors.glass, colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {children}
    </View>
  );

  if (animate) {
    return <Animated.View style={animatedStyle}>{content}</Animated.View>;
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: 16,
    overflow: 'hidden',
    ...shadows.md,
  },
});
