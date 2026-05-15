import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography, spacing } from '../theme';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';

interface OutletProgressProps {
  name: string;
  code: string;
  status: string;
  progress: number;
  address?: string;
  onPress?: () => void;
}

export function OutletProgress({ name, code, status, progress, address }: OutletProgressProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.code}>{code}</Text>
        </View>
        <StatusBadge status={status} size="sm" />
      </View>
      {address && <Text style={styles.address}>{address}</Text>}
      <View style={styles.progressRow}>
        <ProgressBar progress={progress} color={progress >= 1 ? colors.success : colors.info} />
        <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  code: {
    ...typography.caption,
    color: colors.textMuted,
  },
  address: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressText: {
    ...typography.small,
    color: colors.textMuted,
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
  },
});
