import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
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
  stockQuantity: number;
  distributedQuantity: number;
  mtdCE: number;
  mtdCC: number;
  ceRate: number;
  issueQuantity: number;
  mtdCoverage: number;
  mtdExecution: number;
  dropSize: number;
  focQuantity: number;
  discountAmount: number;
  distributedSKU: number;
  saleQuantity: number;
  routeProgress: number;
  activeRoutes: number;
  pendingRoutes: number;
}

function InfoRow({ icon, label, value }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={14} color="rgba(255,255,255,0.8)" />
      <Text style={styles.infoText}>{label}: {value}</Text>
    </View>
  );
}

function KpiCell({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={styles.kpiCell}>
      <Text style={[styles.kpiCellValue, { color }]}>{value}</Text>
      <Text style={styles.kpiCellLabel}>{label}</Text>
    </View>
  );
}

function SalesRow({ label, value, isTotal, color }: { label: string; value: string; isTotal?: boolean; color?: string }) {
  return (
    <View style={styles.salesRow}>
      <Text style={[styles.salesRowLabel, isTotal && styles.salesRowLabelTotal]}>{label}</Text>
      <Text style={[styles.salesRowValue, isTotal && styles.salesRowValueTotal, color ? { color } : undefined]}>
        {value}
      </Text>
    </View>
  );
}

function MenuButton({ icon, label, color, onPress }: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; color: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.menuButton}>
      <View style={[styles.menuIconWrap, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export function DashboardScreen() {
  const { user, selectedBU, selectedAWS } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline] = useState(true);
  const [dataStatus, setDataStatus] = useState<'success' | 'fail'>('success');

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

  useEffect(() => {
    const interval = setInterval(() => {
      setDataStatus((prev) => (prev === 'success' ? 'fail' : 'success'));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const employeeCode = `EMP-${user?.id?.replace('usr_', '').padStart(3, '0') || '000'}`;

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSub}>Loading...</Text>
        </LinearGradient>
        <View style={styles.content}>
          <SkeletonLoader />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header Card */}
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoRow}>
              <MaterialCommunityIcons name="store" size={24} color={colors.textInverse} />
              <Text style={styles.logoText}>CRM-SFA</Text>
            </View>
            <Text style={styles.headerName}>{user?.name}</Text>
            <Text style={styles.headerEmp}>{employeeCode}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerBtn}>
              <MaterialCommunityIcons name="cog-outline" size={22} color={colors.textInverse} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerBtn}>
              <MaterialCommunityIcons name="calendar-check-outline" size={22} color={colors.textInverse} />
            </TouchableOpacity>
          </View>
        </View>
        <InfoRow icon="domain" label="Team" value={selectedBU?.name || '-'} />
        <InfoRow icon="map-marker" label="Area" value={selectedAWS?.code || '-'} />
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.success : colors.error }]} />
            <Text style={styles.statusText}>
              Internet: {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <MaterialCommunityIcons
              name={dataStatus === 'success' ? 'check-circle' : 'alert-circle'}
              size={14}
              color={dataStatus === 'success' ? colors.success : colors.error}
            />
            <Text style={styles.statusText}>
              Data: {dataStatus === 'success' ? 'Up to date' : 'Update failed'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Summary KPI Section — Classic ERP Table */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="poll" size={16} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>SUMMARY</Text>
        </View>
        <View style={styles.kpiTable}>
          <View style={styles.kpiRow}>
            <KpiCell
              value={`${stats?.visitedOutlets || 0}/${stats?.totalOutlets || 0}`}
              label="Outlet Visit"
              color={colors.info}
            />
            <View style={styles.kpiColDivider} />
            <KpiCell
              value={`${stats?.ceRate || 0}%`}
              label="CE Progress"
              color={colors.success}
            />
          </View>
          <View style={styles.kpiRowDivider} />
          <View style={styles.kpiRow}>
            <KpiCell
              value={String(stats?.issueQuantity || 0)}
              label="Issue Qty"
              color={colors.error}
            />
            <View style={styles.kpiColDivider} />
            <KpiCell
              value={(stats?.stockQuantity || 0).toLocaleString()}
              label="Stock Qty"
              color={colors.accent}
            />
          </View>
          <View style={styles.kpiRowDivider} />
          <View style={styles.kpiRow}>
            <KpiCell
              value={`${stats?.mtdCoverage || 0}%`}
              label="MTD Coverage"
              color={colors.secondary}
            />
            <View style={styles.kpiColDivider} />
            <KpiCell
              value={`${stats?.mtdExecution || 0}%`}
              label="MTD Execution"
              color={colors.warning}
            />
          </View>
          <View style={styles.kpiRowDivider} />
          <View style={styles.kpiRow}>
            <KpiCell
              value={`$${((stats?.dropSize || 0) / 1000).toFixed(1)}K`}
              label="Drop Size"
              color="#9C27B0"
            />
            <View style={styles.kpiColDivider} />
            <KpiCell
              value={String(stats?.distributedSKU || 0)}
              label="Dist. SKU"
              color="#00BCD4"
            />
          </View>
        </View>

        {/* Sales Performance Section — Invoice Summary */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="chart-line" size={16} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>SALES PERFORMANCE</Text>
        </View>
        <View style={styles.salesCard}>
          <SalesRow label="Sales Quantity" value={String(stats?.saleQuantity || 0)} />
          <SalesRow label="FoC Quantity" value={String(stats?.focQuantity || 0)} />
          <SalesRow label="Discount" value={`$${((stats?.discountAmount || 0) / 1000).toFixed(1)}K`} />
          <View style={styles.salesDivider} />
          <SalesRow label="Total Sales" value={`$${((stats?.totalSales || 0) / 1000).toFixed(1)}K`} isTotal color={colors.success} />
        </View>

        {/* Main Action Menu Grid */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="view-grid" size={16} color={colors.textSecondary} />
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        </View>
        <View style={styles.menuGrid}>
          <MenuButton icon="cart-plus" label="Sale" color={colors.primary} onPress={() => {}} />
          <MenuButton icon="file-chart" label="Summary" color={colors.secondary} onPress={() => {}} />
          <MenuButton icon="note-text" label="Memo" color={colors.accent} onPress={() => {}} />
          <MenuButton icon="package-variant-closed" label="Stock" color="#9C27B0" onPress={() => {}} />
          <MenuButton icon="check-circle" label="Sale Submit" color={colors.success} onPress={() => {}} />
          <MenuButton icon="sale" label="Promotion" color={colors.warning} onPress={() => {}} />
        </View>

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
    paddingBottom: spacing.lg,
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
    alignItems: 'flex-start',
  },
  headerLeft: {},
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  logoText: {
    ...typography.captionBold,
    color: colors.textInverse,
    letterSpacing: 2,
  },
  headerName: {
    ...typography.h3,
    color: colors.textInverse,
  },
  headerEmp: {
    ...typography.small,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  infoText: {
    ...typography.small,
    color: 'rgba(255,255,255,0.8)',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...typography.small,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  kpiTable: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  kpiRow: {
    flexDirection: 'row',
  },
  kpiColDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  kpiRowDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  kpiCell: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
  },
  kpiCellValue: {
    ...typography.h4,
    fontSize: 20,
    fontWeight: '800',
  },
  kpiCellLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  salesCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  salesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  salesRowLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  salesRowLabelTotal: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  salesRowValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  salesRowValueTotal: {
    ...typography.h4,
    fontWeight: '800',
  },
  salesDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  menuButton: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 90,
  },
  menuIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  menuLabel: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
