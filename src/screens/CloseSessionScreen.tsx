import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import { AnimatedButton } from '../components/AnimatedButton';
import { useAuth } from '../hooks/useAuth';

export function CloseSessionScreen() {
  const navigation = useNavigation();
  const { user, selectedBU, selectedAWS, logout } = useAuth();
  const [closing, setClosing] = useState(false);
  const [closed, setClosed] = useState(false);

  const handleCloseSession = async () => {
    setClosing(true);
    setTimeout(async () => {
      setClosing(false);
      setClosed(true);
      await logout();
    }, 2000);
  };

  if (closed) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[colors.primaryDark, colors.primary, colors.primaryLight]}
          style={styles.fullGradient}
        >
          <View style={styles.centeredContent}>
            <View style={styles.bigIconBox}>
              <Text style={styles.bigIcon}>✓</Text>
            </View>
            <Text style={styles.closedTitle}>Session Closed</Text>
            <Text style={styles.closedSub}>Thank you for your work today!</Text>
            <View style={styles.statsCard}>
              <Text style={styles.statsDate}>
                {new Date().toLocaleDateString('en-ID', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </Text>
              <View style={styles.statsDivider} />
              <Text style={styles.statsUser}>{user?.name}</Text>
              <Text style={styles.statsBU}>{selectedBU?.name}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <Text style={styles.headerTitle}>Close Session</Text>
        <Text style={styles.headerSub}>End your daily work session</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <GlassCard>
          <View style={styles.sessionInfo}>
            <Text style={styles.sectionTitle}>Session Summary</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sales Rep</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Unit</Text>
              <Text style={styles.infoValue}>{selectedBU?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>AWS Period</Text>
              <Text style={styles.infoValue}>{selectedAWS?.code}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {new Date().toLocaleDateString('en-ID', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={styles.warningCard}>
          <View style={styles.warningContent}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.warningText}>
              <Text style={styles.warningTitle}>Before you close:</Text>
              <Text style={styles.warningItem}>• Complete all outlet visits</Text>
              <Text style={styles.warningItem}>• Submit settlement report</Text>
              <Text style={styles.warningItem}>• Ensure all sales are recorded</Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard>
          <Text style={styles.sectionTitle}>Daily Progress</Text>
          <View style={styles.progressItem}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>Route Plan</Text>
              <StatusBadge status="completed" size="sm" />
            </View>
            <ProgressBar progress={1} color={colors.success} />
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>Sales</Text>
              <StatusBadge status="completed" size="sm" />
            </View>
            <ProgressBar progress={1} color={colors.success} />
          </View>
          <View style={styles.progressItem}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>Settlement</Text>
              <StatusBadge status="completed" size="sm" />
            </View>
            <ProgressBar progress={1} color={colors.success} />
          </View>
        </GlassCard>
      </ScrollView>

      <View style={styles.footer}>
        <AnimatedButton
          title={closing ? 'Closing Session...' : '🔒 Close Daily Session'}
          onPress={handleCloseSession}
          loading={closing}
          disabled={closing}
          fullWidth
          size="lg"
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: spacing.huge + 10,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textInverse,
  },
  headerSub: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sessionInfo: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  warningCard: {
    marginTop: spacing.md,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: colors.warning,
  },
  warningContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  warningIcon: {
    fontSize: 24,
  },
  warningText: {
    flex: 1,
  },
  warningTitle: {
    ...typography.captionBold,
    color: colors.warning,
    marginBottom: spacing.xs,
  },
  warningItem: {
    ...typography.small,
    color: colors.textSecondary,
  },
  progressItem: {
    marginBottom: spacing.md,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fullGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredContent: {
    alignItems: 'center',
    padding: spacing.xxl,
  },
  bigIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  bigIcon: {
    fontSize: 50,
    color: colors.textInverse,
    fontWeight: '700',
  },
  closedTitle: {
    ...typography.h1,
    color: colors.textInverse,
    marginBottom: spacing.sm,
  },
  closedSub: {
    ...typography.body,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  statsDate: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  statsDivider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: spacing.md,
  },
  statsUser: {
    ...typography.h4,
    color: colors.textInverse,
  },
  statsBU: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
});
