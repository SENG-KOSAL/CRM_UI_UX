import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadiusSize?: number;
  style?: ViewStyle;
}

function SkeletonBlock({ width = '100%', height = 20, borderRadiusSize = borderRadius.sm, style }: SkeletonLoaderProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.7, { duration: 1000 }), withTiming(0.3, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.block,
        { width: width as any, height, borderRadius: borderRadiusSize },
        style,
        animatedStyle,
      ]}
    />
  );
}

interface SkeletonCardProps {
  lines?: number;
  style?: ViewStyle;
}

export function SkeletonCard({ lines = 3, style }: SkeletonCardProps) {
  return (
    <View style={[styles.card, style]}>
      <SkeletonBlock width="60%" height={16} borderRadiusSize={8} />
      <View style={styles.spacer} />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock
          key={i}
          width={i === lines - 1 ? '40%' : '100%'}
          height={14}
          borderRadiusSize={7}
          style={styles.line}
        />
      ))}
    </View>
  );
}

export function SkeletonLoader({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.container, style]}>
      <SkeletonCard lines={2} />
      <View style={styles.row}>
        <SkeletonCard lines={1} style={{ flex: 1 }} />
        <View style={{ width: spacing.md }} />
        <SkeletonCard lines={1} style={{ flex: 1 }} />
      </View>
      <SkeletonCard lines={4} />
      <SkeletonCard lines={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  block: {
    backgroundColor: colors.border,
  },
  spacer: {
    height: spacing.md,
  },
  line: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
});
