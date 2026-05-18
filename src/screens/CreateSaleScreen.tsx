import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { ProgressBar } from '../components/ProgressBar';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { RoutesStackParamList } from '../navigation/types';
import type { StockSchema, ProgramSchema } from '../database/schema';

type CreateSaleNavProp = StackNavigationProp<RoutesStackParamList, 'CreateSale'>;
type CreateSaleRouteProp = RouteProp<RoutesStackParamList, 'CreateSale'>;

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function CreateSaleScreen() {
  const navigation = useNavigation<CreateSaleNavProp>();
  const route = useRoute<CreateSaleRouteProp>();
  const { outlet, route: routeData, programs } = route.params;
  const { user, selectedBU, selectedAWS } = useAuth();

  const [stock, setStock] = useState<StockSchema[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && selectedBU && selectedAWS) loadStock();
  }, []);

  const loadStock = async () => {
    try {
      const data = await mockApi.stock.getByUser(user!.id, selectedBU!.id, selectedAWS!.id);
      setStock(data);
    } catch (err) {}
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadStock();
    } catch (err) {
    } finally {
      setRefreshing(false);
    }
  };

  const addToCart = (item: StockSchema) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === item.productId);
      if (existing) {
        return prev.map((c) =>
          c.productId === item.productId
            ? { ...c, quantity: c.quantity + 1, totalPrice: (c.quantity + 1) * c.unitPrice }
            : c
        );
      }
      return [...prev, {
        productId: item.productId,
        productName: item.productName,
        quantity: 1,
        unitPrice: item.price,
        totalPrice: item.price,
      }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.productId !== productId) return c;
        const newQty = Math.max(0, c.quantity + delta);
        return { ...c, quantity: newQty, totalPrice: newQty * c.unitPrice };
      }).filter((c) => c.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, c) => sum + c.totalPrice, 0);
  const discount = programs.reduce((sum, p) => {
    if (p.discountType === 'percentage') {
      return sum + Math.min(subtotal * (p.discountValue / 100), p.maxDiscount);
    }
    return sum + Math.min(p.discountValue, p.maxDiscount);
  }, 0);
  const total = Math.max(0, subtotal - discount);

  const handleCreateSale = async () => {
    if (cart.length === 0) return;
    setCreating(true);
    try {
      // Auto stock reduction
      for (const item of cart) {
        await mockApi.stock.reduceStock(
          item.productId, item.quantity, user!.id, selectedBU!.id, selectedAWS!.id
        );
      }

      await mockApi.sales.create({
        outletId: outlet.id,
        userId: user!.id,
        routeId: routeData.id,
        buId: selectedBU!.id,
        awsId: selectedAWS!.id,
        items: cart,
        subtotal,
        discount,
        tax: 0,
        total,
        paymentMethod,
        status: 'completed',
        visitStatus: 'sale_completed',
      });

      setCreated(true);
    } catch (err) {
    } finally {
      setCreating(false);
    }
  };

  const handleCheckOut = () => {
    navigation.navigate('CheckOut', { outlet, route: routeData });
  };

  if (created) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
          <Text style={styles.headerTitle}>Sale Created!</Text>
          <Text style={styles.headerSub}>{outlet.name}</Text>
        </LinearGradient>
        <View style={styles.successContainer}>
          <View style={styles.successIconBox}>
            <Text style={styles.bigSuccessIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Transaction Successful</Text>
          <Text style={styles.successTotal}>Rp {total.toLocaleString()}</Text>
          <Text style={styles.successSub}>{cart.reduce((s, c) => s + c.quantity, 0)} items sold</Text>
          <View style={styles.successFooter}>
            <AnimatedButton title="→ Proceed to Check-Out" onPress={handleCheckOut} fullWidth size="lg" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Sale</Text>
        <Text style={styles.headerSub}>{outlet.name}</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Products */}
        <Text style={styles.sectionTitle}>Products</Text>
        <View style={styles.productsGrid}>
          {stock.map((item) => {
            const inCart = cart.find((c) => c.productId === item.productId);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => addToCart(item)}
                activeOpacity={0.85}
                style={styles.productCard}
              >
                <Text style={styles.productNameSmall}>{item.productName}</Text>
                <Text style={styles.productPrice}>Rp {item.price.toLocaleString()}</Text>
                <View style={styles.productMeta}>
                  <Text style={styles.productStock}>
                    Stock: {item.currentStock} {item.unit}
                  </Text>
                  {inCart && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{inCart.quantity}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Cart */}
        {cart.length > 0 && (
          <GlassCard style={styles.cartCard}>
            <Text style={styles.sectionTitle}>Cart</Text>
            {cart.map((item) => (
              <View key={item.productId} style={styles.cartItem}>
                <View style={styles.cartInfo}>
                  <Text style={styles.cartName}>{item.productName}</Text>
                  <Text style={styles.cartPrice}>Rp {item.unitPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    onPress={() => updateQty(item.productId, -1)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    onPress={() => updateQty(item.productId, 1)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.cartTotal}>Rp {item.totalPrice.toLocaleString()}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            {/* Programs Applied */}
            {programs.length > 0 && (
              <View style={styles.discountSection}>
                <Text style={styles.discountTitle}>Programs Applied</Text>
                {programs.map((p) => (
                  <View key={p.id} style={styles.discountRow}>
                    <Text style={styles.discountName}>{p.name}</Text>
                    <Text style={styles.discountValue}>
                      -Rp {Math.min(
                        p.discountType === 'percentage'
                          ? subtotal * (p.discountValue / 100)
                          : p.discountValue,
                        p.maxDiscount
                      ).toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* No Programs Indicator */}
            {programs.length === 0 && (
              <View style={styles.noProgramsSection}>
                <Text style={styles.noProgramsIcon}>ℹ️</Text>
                <Text style={styles.noProgramsText}>No programs applied to this sale</Text>
              </View>
            )}

            {/* Payment Method */}
            <Text style={styles.sectionTitle}>Payment</Text>
            <View style={styles.paymentRow}>
              {['cash', 'transfer', 'qris'].map((method) => (
                <TouchableOpacity
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  style={[
                    styles.paymentOption,
                    paymentMethod === method && styles.paymentSelected,
                  ]}
                >
                  <Text style={[
                    styles.paymentText,
                    paymentMethod === method && styles.paymentTextSelected,
                  ]}>
                    {method === 'cash' ? '💵 Cash' : method === 'transfer' ? '🏦 Transfer' : '📱 QRIS'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Total */}
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>Rp {subtotal.toLocaleString()}</Text>
              </View>
              {discount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Discount</Text>
                  <Text style={[styles.totalValue, styles.discountText]}>
                    -Rp {discount.toLocaleString()}
                  </Text>
                </View>
              )}
              <View style={styles.totalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>Rp {total.toLocaleString()}</Text>
              </View>
            </View>
          </GlassCard>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AnimatedButton
          title={creating ? 'Creating Sale...' : `Create Sale • Rp ${total.toLocaleString()}`}
          onPress={handleCreateSale}
          loading={creating}
          disabled={cart.length === 0 || creating}
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
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  productCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
    position: 'relative',
  },
  productNameSmall: {
    ...typography.captionBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  productPrice: {
    ...typography.bodyBold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productStock: {
    ...typography.small,
    color: colors.textMuted,
  },
  cartBadge: {
    backgroundColor: colors.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  cartCard: {
    marginBottom: spacing.lg,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cartInfo: {
    flex: 1,
  },
  cartName: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  cartPrice: {
    ...typography.small,
    color: colors.textMuted,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyBtnText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  qtyValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  cartTotal: {
    ...typography.captionBold,
    color: colors.textPrimary,
    minWidth: 80,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  discountSection: {
    marginBottom: spacing.md,
  },
  discountTitle: {
    ...typography.captionBold,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  discountName: {
    ...typography.small,
    color: colors.textSecondary,
  },
  discountValue: {
    ...typography.small,
    color: colors.error,
    fontWeight: '600',
  },
  noProgramsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(100, 150, 200, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(100, 150, 200, 0.3)',
  },
  noProgramsIcon: {
    fontSize: 20,
  },
  noProgramsText: {
    ...typography.small,
    color: colors.textSecondary,
    flex: 1,
  },
  paymentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  paymentOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
  },
  paymentSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryFaded,
  },
  paymentText: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  paymentTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  totalSection: {
    gap: spacing.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  totalValue: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  discountText: {
    color: colors.error,
  },
  grandTotalLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  grandTotalValue: {
    ...typography.h4,
    color: colors.primary,
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
    backgroundColor: colors.background,
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
  bigSuccessIcon: {
    fontSize: 40,
    color: colors.primary,
    fontWeight: '700',
  },
  successTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  successTotal: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  successSub: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xxl,
  },
  successFooter: {
    width: '100%',
    marginTop: spacing.xxl,
  },
});
