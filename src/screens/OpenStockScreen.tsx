import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { mockApi } from '../services/mockApi';
import { AuthStackParamList } from '../navigation/types';
import type { ProductSchema } from '../database/schema';

type OpenStockNavProp = StackNavigationProp<AuthStackParamList, 'OpenStock'>;

interface Props {
  navigation: OpenStockNavProp;
  route: any;
}

export function OpenStockScreen({ navigation, route }: Props) {
  const [catalog, setCatalog] = useState<ProductSchema[]>([]);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const user = route?.params?.user;
  const bu = route?.params?.businessUnit;
  const aws = route?.params?.aws;

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      const data = await mockApi.stock.getProductCatalog();
      setCatalog(data);
    } catch {}
    setLoading(false);
  };

  const setQty = (id: string, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    setQuantities((prev) => ({ ...prev, [id]: cleaned }));
  };

  const adjustQty = (id: string, delta: number) => {
    const current = parseInt(quantities[id] || '0', 10);
    const next = Math.max(0, current + delta);
    setQuantities((prev) => ({ ...prev, [id]: next > 0 ? String(next) : '' }));
  };

  const stockedCount = catalog.filter((p) => {
    const q = parseInt(quantities[p.id] || '0', 10);
    return q > 0;
  }).length;

  const totalValue = catalog.reduce((sum, p) => {
    const q = parseInt(quantities[p.id] || '0', 10);
    return sum + q * p.price;
  }, 0);

  const handleSave = async () => {
    setSaving(true);
    console.log('[OpenStockScreen] handleSave called, quantities:', quantities);
    try {
      const entries = catalog
        .map((p) => ({
          productId: p.id,
          productName: p.productName,
          productCode: p.productCode,
          unit: p.unit,
          price: p.price,
          quantity: parseInt(quantities[p.id] || '0', 10),
        }))
        .filter((e) => e.quantity > 0);
      console.log('[OpenStockScreen] Entries to save:', entries);
      if (entries.length > 0) {
        console.log('[OpenStockScreen] About to call saveOpeningStock');
        await mockApi.stock.saveOpeningStock(user.id, bu.id, aws.id, entries);
        console.log('[OpenStockScreen] saveOpeningStock completed successfully');
      }
      navigation.navigate('StartSession', { user, businessUnit: bu, aws });
    } catch (err) {
      console.error('[OpenStock] handleSave error:', err);
    }
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <Text style={styles.headerTitle}>Open Stock</Text>
        <Text style={styles.headerSub}>Add stock for today's sales</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stockedCount}/{catalog.length}</Text>
          <Text style={styles.statLabel}>Products Stocked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>Rp {totalValue.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Products & Enter Quantities</Text>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={catalog}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const qty = quantities[item.id] || '';
              const qtyNum = parseInt(qty || '0', 10);

              return (
                <GlassCard animate delay={index * 60}>
                  <View style={styles.productRow}>
                    <View style={styles.imageBox}>
                      <Text style={styles.productImage}>{item.productIcon}</Text>
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.productName}</Text>
                      <Text style={styles.productCode}>{item.productCode}</Text>
                      <Text style={styles.productMeta}>
                        Rp {item.price.toLocaleString()} / {item.unit}
                      </Text>
                    </View>
                    <View style={styles.qtySection}>
                      <View style={styles.qtyControls}>
                        <TouchableOpacity
                          onPress={() => adjustQty(item.id, -1)}
                          style={[styles.qtyBtn, qtyNum <= 0 && styles.qtyBtnDisabled]}
                          disabled={qtyNum <= 0}
                        >
                          <Text style={[styles.qtyBtnText, qtyNum <= 0 && styles.qtyBtnTextDisabled]}>−</Text>
                        </TouchableOpacity>
                        <TextInput
                          style={styles.qtyInput}
                          value={qty}
                          onChangeText={(v) => setQty(item.id, v)}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={colors.textMuted}
                          selectTextOnFocus
                        />
                        <TouchableOpacity
                          onPress={() => adjustQty(item.id, 1)}
                          style={styles.qtyBtn}
                        >
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.qtyUnit}>{item.unit}</Text>
                    </View>
                  </View>
                  {qtyNum > 0 && (
                    <View style={styles.subtotalRow}>
                      <Text style={styles.subtotalLabel}>Subtotal</Text>
                      <Text style={styles.subtotalValue}>Rp {(qtyNum * item.price).toLocaleString()}</Text>
                    </View>
                  )}
                </GlassCard>
              );
            }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <AnimatedButton
          title={saving ? 'Saving...' : stockedCount > 0 ? `Save ${stockedCount} Product(s) & Continue` : 'Skip & Continue'}
          onPress={handleSave}
          loading={saving}
          disabled={saving}
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
    paddingTop: spacing.huge + 20,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xxl,
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
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: -spacing.xl,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  statLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
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
  loader: {
    marginTop: spacing.huge,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.huge,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  productImage: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  productName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  productCode: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  productMeta: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  qtySection: {
    alignItems: 'center',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    backgroundColor: colors.border,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 20,
  },
  qtyBtnTextDisabled: {
    color: colors.textMuted,
  },
  qtyInput: {
    width: 50,
    height: 36,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
    textAlign: 'center',
    ...typography.bodyBold,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  qtyUnit: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 4,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  subtotalLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  subtotalValue: {
    ...typography.captionBold,
    color: colors.success,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
