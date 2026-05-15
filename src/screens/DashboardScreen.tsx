import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { KPICard } from '../components/KPICard';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/StatusBadge';
import { AnimatedButton } from '../components/AnimatedButton';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';

interface DashboardStats {
  totalSales: number;
  totalToday: number;
  salesCount: number;
  todaySalesCount: number;
  totalOutlets: number;
  visitedOutlets: number;
  remainingOutlets: number;
  totalStockValue: number;
  routeProgress: number;
  activeRoutes: number;
  pendingRoutes: number;
}

export function DashboardScreen() {
  const { user, selectedBU, selectedAWS } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user && selectedBU && selectedAWS) {
        loadStats();
      }
    }, [user?.id, selectedBU?.id, selectedAWS?.id])
  );

  const loadStats = async () => {
    try {
      const data = await mockApi.dashboard.getStats(user!.id, selectedBU!.id);
      setStats(data);
    } catch (err) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const QuickAccessCard = ({ title, icon, color, onPress, subtitle }: {
    title: string; icon: string; color: string; onPress: () => void; subtitle?: string;
  }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{ flex: 1 }}>
      <View style={[styles.quickCard, { borderLeftColor: color }]}>
        <Text style={styles.quickIcon}>{icon}</Text>
        <Text style={styles.quickTitle}>{title}</Text>
        {subtitle && <Text style={styles.quickSub}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSub}>Loading your session...</Text>
        </LinearGradient>
        <View style={styles.content}>
          <SkeletonLoader />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
        </View>
        <View style={styles.headerMeta}>
          <StatusBadge status="active" size="sm" />
          <Text style={styles.metaText}>{selectedBU?.name}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>{selectedAWS?.code}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* KPI Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiRow}>
          <View style={styles.kpiRowInner}>
            <KPICard
              title="Today Sales"
              value={`Rp ${(stats?.totalToday || 0).toLocaleString()}`}
              subtitle={`${stats?.todaySalesCount || 0} transactions`}
              color={colors.primary}
              trend="up"
              trendValue="+12%"
            />
            <View style={{ width: spacing.md }} />
            <KPICard
              title="Outlets Visited"
              value={`${stats?.visitedOutlets || 0}/${stats?.totalOutlets || 0}`}
              subtitle={`${stats?.remainingOutlets || 0} remaining`}
              color={colors.info}
            />
            <View style={{ width: spacing.md }} />
            <KPICard
              title="Stock Value"
              value={`Rp ${((stats?.totalStockValue || 0) / 1000000).toFixed(1)}M`}
              color={colors.accent}
            />
          </View>
        </ScrollView>

        {/* Session Progress */}
        <GlassCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.sectionTitle}>Session Progress</Text>
            <Text style={styles.progressPercent}>
              {Math.round((stats?.routeProgress || 0) * 100)}%
            </Text>
          </View>
          <ProgressBar progress={stats?.routeProgress || 0} />
          <View style={styles.progressMeta}>
            <View style={styles.progressStat}>
              <View style={[styles.progressDot, { backgroundColor: colors.success }]} />
              <Text style={styles.progressLabel}>{stats?.activeRoutes || 0} Active</Text>
            </View>
            <View style={styles.progressStat}>
              <View style={[styles.progressDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.progressLabel}>{stats?.pendingRoutes || 0} Pending</Text>
            </View>
          </View>
        </GlassCard>

        {/* Quick Access */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickGrid}>
          <QuickAccessCard
            title="Route Plan"
            icon="📍"
            color={colors.primary}
            subtitle="View routes"
            onPress={() => {}}
          />
          <QuickAccessCard
            title="Sales"
            icon="💰"
            color={colors.info}
            subtitle="New transaction"
            onPress={() => {}}
          />
        </View>
        <View style={styles.quickGrid}>
          <QuickAccessCard
            title="Stock"
            icon="📦"
            color={colors.accent}
            subtitle="Check inventory"
            onPress={() => {}}
          />
          <QuickAccessCard
            title="Programs"
            icon="🎯"
            color="#9C27B0"
            subtitle="Active promos"
            onPress={() => {}}
          />
        </View>

        {/* Recent Sales */}
        <GlassCard>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{stats?.salesCount || 0}</Text>
              <Text style={styles.summaryLabel}>Total Sales</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{stats?.visitedOutlets || 0}</Text>
              <Text style={styles.summaryLabel}>Outlets</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                Rp {((stats?.totalSales || 0) / 1000000).toFixed(1)}M
              </Text>
              <Text style={styles.summaryLabel}>Revenue</Text>
            </View>
          </View>
        </GlassCard>

        <View style={{ height: spacing.huge }} />
      </ScrollView>
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
    ...typography.h2,
    color: colors.textInverse,
  },
  headerSub: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    ...typography.h3,
    color: colors.textInverse,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.captionBold,
    color: colors.textInverse,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  metaText: {
    ...typography.small,
    color: 'rgba(255,255,255,0.7)',
  },
  metaDot: {
    color: 'rgba(255,255,255,0.4)',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  kpiRow: {
    marginBottom: spacing.lg,
  },
  kpiRowInner: {
    flexDirection: 'row',
    paddingRight: spacing.lg,
  },
  progressCard: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressPercent: {
    ...typography.h4,
    color: colors.primary,
  },
  progressMeta: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.md,
  },
  progressStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressLabel: {
    ...typography.small,
    color: colors.textMuted,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  quickCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    flex: 1,
    ...shadows.md,
  },
  quickIcon: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  quickTitle: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  quickSub: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  summaryValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  summaryLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
});
