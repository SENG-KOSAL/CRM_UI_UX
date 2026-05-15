import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import type { SaleSchema } from '../database/schema';

export function SettlementScreen() {
  const navigation = useNavigation();
  const { user, selectedBU, selectedAWS } = useAuth();
  const [sales, setSales] = useState<SaleSchema[]>([]);
  const [cashInHand, setCashInHand] = useState('');
  const [bankDeposits, setBankDeposits] = useState('');
  const [expenses, setExpenses] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user && selectedBU && selectedAWS) loadSales();
  }, []);

  const loadSales = async () => {
    const allSales = await mockApi.sales.getByRoute('');
    const userSales = allSales.filter((s) => s.userId === user!.id);
    setSales(userSales);
  };

  const totalCash = sales.filter((s) => s.paymentMethod === 'cash').reduce((sum, s) => sum + s.total, 0);
  const totalTransfer = sales.filter((s) => s.paymentMethod === 'transfer').reduce((sum, s) => sum + s.total, 0);
  const totalQRIS = sales.filter((s) => s.paymentMethod === 'qris').reduce((sum, s) => sum + s.total, 0);
  const grandTotal = totalCash + totalTransfer + totalQRIS;
  const totalExpenses = parseInt(expenses) || 0;
  const totalBank = parseInt(bankDeposits) || 0;
  const totalCashInHand = parseInt(cashInHand) || 0;
  const outstanding = totalCash - totalCashInHand - totalExpenses;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
          <Text style={styles.headerTitle}>Settlement</Text>
          <Text style={styles.headerSub}>Day reconciled</Text>
        </LinearGradient>
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Settlement Complete</Text>
          <Text style={styles.successSub}>All transactions have been reconciled</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <Text style={styles.headerTitle}>Settlement</Text>
        <Text style={styles.headerSub}>Reconcile your daily transactions</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <GlassCard>
          <Text style={styles.sectionTitle}>Sales by Payment</Text>
          <View style={styles.paymentRow}>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>💵 Cash</Text>
              <Text style={styles.paymentValue}>Rp {totalCash.toLocaleString()}</Text>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>🏦 Transfer</Text>
              <Text style={styles.paymentValue}>Rp {totalTransfer.toLocaleString()}</Text>
            </View>
            <View style={styles.paymentItem}>
              <Text style={styles.paymentLabel}>📱 QRIS</Text>
              <Text style={styles.paymentValue}>Rp {totalQRIS.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total Sales</Text>
            <Text style={styles.grandTotalValue}>Rp {grandTotal.toLocaleString()}</Text>
          </View>
        </GlassCard>

        <GlassCard>
          <Text style={styles.sectionTitle}>Reconciliation</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cash in Hand (Physical)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter cash amount"
              placeholderTextColor={colors.textMuted}
              value={cashInHand}
              onChangeText={setCashInHand}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bank Deposits</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter bank deposit amount"
              placeholderTextColor={colors.textMuted}
              value={bankDeposits}
              onChangeText={setBankDeposits}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Expenses</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter expenses"
              placeholderTextColor={colors.textMuted}
              value={expenses}
              onChangeText={setExpenses}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.reconcileRow}>
            <Text style={styles.reconcileLabel}>Total Cash Sales</Text>
            <Text style={styles.reconcileValue}>Rp {totalCash.toLocaleString()}</Text>
          </View>
          <View style={styles.reconcileRow}>
            <Text style={styles.reconcileLabel}>Cash in Hand</Text>
            <Text style={[styles.reconcileValue, totalCashInHand > 0 && { color: colors.success }]}>
              Rp {totalCashInHand.toLocaleString()}
            </Text>
          </View>
          <View style={styles.reconcileRow}>
            <Text style={styles.reconcileLabel}>Expenses</Text>
            <Text style={[styles.reconcileValue, totalExpenses > 0 && { color: colors.error }]}>
              Rp {totalExpenses.toLocaleString()}
            </Text>
          </View>
          <View style={styles.reconcileDivider} />
          <View style={styles.reconcileRow}>
            <Text style={styles.reconcileTotalLabel}>Outstanding</Text>
            <Text style={[
              styles.reconcileTotalValue,
              { color: outstanding === 0 ? colors.success : outstanding > 0 ? colors.warning : colors.error },
            ]}>
              Rp {outstanding.toLocaleString()}
            </Text>
          </View>
          {outstanding !== 0 && (
            <Text style={styles.outstandingHint}>
              {outstanding > 0
                ? 'There is outstanding cash to be deposited'
                : 'There is a cash deficit to be accounted for'}
            </Text>
          )}
        </GlassCard>
      </ScrollView>

      <View style={styles.footer}>
        <AnimatedButton
          title="Submit Settlement"
          onPress={handleSubmit}
          fullWidth
          size="lg"
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
  paymentRow: {
    gap: spacing.md,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  paymentValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  grandTotalValue: {
    ...typography.h4,
    color: colors.primary,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  reconcileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  reconcileLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  reconcileValue: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  reconcileDivider: {
    height: 2,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  reconcileTotalLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  reconcileTotalValue: {
    ...typography.h4,
  },
  outstandingHint: {
    ...typography.small,
    color: colors.warning,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  successIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successIcon: {
    fontSize: 40,
    color: colors.primary,
    fontWeight: '700',
  },
  successTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  successSub: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
