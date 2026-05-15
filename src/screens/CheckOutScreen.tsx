import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { StatusBadge } from '../components/StatusBadge';
import { mockApi } from '../services/mockApi';
import { RoutesStackParamList } from '../navigation/types';
import type { SaleSchema, SaleItemSchema } from '../database/schema';

type CheckOutNavProp = StackNavigationProp<RoutesStackParamList, 'CheckOut'>;
type CheckOutRouteProp = RouteProp<RoutesStackParamList, 'CheckOut'>;

export function CheckOutScreen() {
  const navigation = useNavigation<CheckOutNavProp>();
  const route = useRoute<CheckOutRouteProp>();
  const { outlet, route: routeData } = route.params;
  const [sales, setSales] = useState<SaleSchema[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    const outletSales = await mockApi.sales.getByOutlet(outlet.id);
    setSales(outletSales);
  };

  const parseItems = (sale: SaleSchema): SaleItemSchema[] =>
    typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items;

  const totalSaleAmount = sales.reduce((s, sale) => s + sale.total, 0);
  const totalItems = sales.reduce((s, sale) => {
    const items = parseItems(sale);
    return s + items.reduce((si, item) => si + item.quantity, 0);
  }, 0);

  const handleCheckOut = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setCheckedOut(true);
    }, 1500);
  };

  const handleBackToRoutes = () => {
    navigation.navigate('RoutePlan');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-Out</Text>
        <Text style={styles.headerSub}>{outlet.name}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <GlassCard>
          <View style={styles.outletRow}>
            <View style={styles.outletIconBox}>
              <Text style={styles.outletIcon}>🏪</Text>
            </View>
            <View style={styles.outletInfo}>
              <Text style={styles.outletName}>{outlet.name}</Text>
              <Text style={styles.outletCode}>{outlet.code}</Text>
            </View>
          </View>
        </GlassCard>

        {checkedOut ? (
          <GlassCard style={styles.successCard}>
            <View style={styles.successContent}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Check-Out Successful!</Text>
              <Text style={styles.successSub}>Visit to {outlet.name} completed</Text>
            </View>
          </GlassCard>
        ) : (
          <>
            <GlassCard style={styles.summaryCard}>
              <Text style={styles.sectionTitle}>Visit Summary</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{sales.length}</Text>
                  <Text style={styles.summaryLabel}>Transactions</Text>
                </View>
                <View style={styles.sumDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{totalItems}</Text>
                  <Text style={styles.summaryLabel}>Items Sold</Text>
                </View>
                <View style={styles.sumDivider} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: colors.primary }]}>
                    Rp {totalSaleAmount.toLocaleString()}
                  </Text>
                  <Text style={styles.summaryLabel}>Total Sales</Text>
                </View>
              </View>
            </GlassCard>

            {sales.length > 0 && (
              <GlassCard>
                <Text style={styles.sectionTitle}>Sale Details</Text>
                {sales.map((sale, index) => (
                  <View key={sale.id} style={styles.saleItem}>
                    <View style={styles.saleTop}>
                      <Text style={styles.saleCode}>{sale.code}</Text>
                      <StatusBadge status={sale.status} size="sm" />
                    </View>
                    <Text style={styles.saleItems}>
                      {parseItems(sale).map((i) => `${i.productName} x${i.quantity}`).join(', ')}
                    </Text>
                    <Text style={styles.saleTotal}>Rp {sale.total.toLocaleString()}</Text>
                    {index < sales.length - 1 && <View style={styles.saleDivider} />}
                  </View>
                ))}
              </GlassCard>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {checkedOut ? (
          <AnimatedButton
            title="← Back to Route Plan"
            onPress={handleBackToRoutes}
            fullWidth
            variant="secondary"
          />
        ) : (
          <AnimatedButton
            title={checkingOut ? 'Checking Out...' : '🚪 Check-Out Now'}
            onPress={handleCheckOut}
            loading={checkingOut}
            disabled={checkingOut}
            fullWidth
            size="lg"
          />
        )}
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  backIcon: {
    fontSize: 28,
    color: colors.textInverse,
    lineHeight: 30,
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
  outletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  outletIconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outletIcon: {
    fontSize: 24,
  },
  outletInfo: {
    flex: 1,
  },
  outletName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  outletCode: {
    ...typography.caption,
    color: colors.textMuted,
  },
  summaryCard: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
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
  sumDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  saleItem: {
    paddingVertical: spacing.sm,
  },
  saleTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  saleCode: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  saleItems: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  saleTotal: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  saleDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
  },
  successCard: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryFaded,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  successContent: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    fontSize: 40,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h4,
    color: colors.primary,
  },
  successSub: {
    ...typography.caption,
    color: colors.primaryDark,
    marginTop: spacing.xs,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
