import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  animated?: boolean;
}

export function ProgressBar({ progress, color = colors.primary, height = 8, animated = true }: ProgressBarProps) {
  const widthVal = useSharedValue(0);

  React.useEffect(() => {
    if (animated) {
      widthVal.value = withSpring(progress, { damping: 20, stiffness: 90 });
    } else {
      widthVal.value = progress;
    }
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${Math.min(widthVal.value * 100, 100)}%`,
  }));

  return (
    <View style={[styles.track, { height }]}>
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color, height },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: borderRadius.round,
  },
});
