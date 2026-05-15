import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography, spacing } from '../theme';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: colors.warning, bg: '#FFF8E1' },
  in_progress: { label: 'In Progress', color: colors.info, bg: '#E3F2FD' },
  completed: { label: 'Completed', color: colors.success, bg: '#E8F5E9' },
  cancelled: { label: 'Cancelled', color: colors.error, bg: '#FFEBEE' },
  checked_in: { label: 'Checked In', color: colors.info, bg: '#E3F2FD' },
  checked_out: { label: 'Checked Out', color: colors.success, bg: '#E8F5E9' },
  sale_completed: { label: 'Sale Done', color: colors.success, bg: '#E8F5E9' },
  draft: { label: 'Draft', color: colors.textMuted, bg: '#F5F5F5' },
  active: { label: 'Active', color: colors.success, bg: '#E8F5E9' },
  not_started: { label: 'Not Started', color: colors.textMuted, bg: '#F5F5F5' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, color: colors.textMuted, bg: '#F5F5F5' };
  const isSm = size === 'sm';

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, isSm && styles.sm]}>
      <View style={[styles.dot, { backgroundColor: config.color }, isSm && styles.smDot]} />
      <Text style={[styles.label, { color: config.color }, isSm && styles.smLabel]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.round,
    gap: 6,
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  smDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...typography.captionBold,
  },
  smLabel: {
    ...typography.small,
    fontWeight: '600',
  },
});
