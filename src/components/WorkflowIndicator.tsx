import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, typography, spacing } from '../theme';

interface WorkflowIndicatorProps {
  currentStep: string;
  steps: { id: string; label: string }[];
}

export function WorkflowIndicator({ currentStep, steps }: WorkflowIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <React.Fragment key={step.id}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.dot,
                    isCompleted && styles.dotCompleted,
                    isCurrent && styles.dotCurrent,
                    isPending && styles.dotPending,
                  ]}
                >
                  {isCompleted && <Text style={styles.check}>✓</Text>}
                  {isCurrent && (
                    <View style={styles.innerDot} />
                  )}
                </View>
                <Text
                  style={[
                    styles.label,
                    (isCompleted || isCurrent) && styles.labelActive,
                    isPending && styles.labelPending,
                  ]}
                  numberOfLines={1}
                >
                  {step.label}
                </Text>
              </View>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    index < currentIndex && styles.lineCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: colors.success,
  },
  dotCurrent: {
    backgroundColor: colors.primaryFaded,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dotPending: {
    backgroundColor: colors.border,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  check: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    ...typography.small,
    fontSize: 9,
    textAlign: 'center',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  labelPending: {
    color: colors.textMuted,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  lineCompleted: {
    backgroundColor: colors.success,
  },
});
