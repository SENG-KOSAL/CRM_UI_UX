import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, typography, spacing, shadows } from '../theme';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, withSpring } from 'react-native-reanimated';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  style?: ViewStyle;
  animate?: boolean;
}

export function KPICard({
  title, value, subtitle, icon, color = colors.primary,
  trend, trendValue, style, animate = true,
}: KPICardProps) {
  const scale = useSharedValue(animate ? 0.9 : 1);
  const opacity = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (animate) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 400 });
    }
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const trendColor = trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textMuted;

  return (
    <Animated.View style={[styles.card, { borderLeftColor: color }, style, animatedStyle]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <Text style={[styles.icon]}>{icon}</Text>}
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {trend && trendValue && (
        <View style={styles.trendRow}>
          <Text style={[styles.trendIcon, { color: trendColor }]}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </Text>
          <Text style={[styles.trendValue, { color: trendColor }]}>{trendValue}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    flex: 1,
    minWidth: 140,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.kpiLabel,
    color: colors.textMuted,
  },
  icon: {
    fontSize: 20,
  },
  value: {
    ...typography.kpi,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 4,
  },
  trendIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  trendValue: {
    ...typography.small,
    fontWeight: '600',
  },
});
