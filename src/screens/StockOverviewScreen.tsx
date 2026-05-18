import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { AnimatedButton } from '../components/AnimatedButton';
import { SkeletonCard } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import type { StockSchema, ProductSchema } from '../database/schema';

export function StockOverviewScreen() {
  const navigation = useNavigation();
  const { user, selectedBU, selectedAWS } = useAuth();
  const [stock, setStock] = useState<StockSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [productIcons, setProductIcons] = useState<Record<string, string>>({});
  const KHR_RATE = 4100;

  useFocusEffect(
    useCallback(() => {
      if (user) loadStock();
    }, [user?.id])
  );

  const loadStock = async () => {
    try {
      const [data, catalog] = await Promise.all([
        mockApi.stock.getAll(),
        mockApi.stock.getProductCatalog(),
      ]);
      const iconMap: Record<string, string> = {};
      for (const p of catalog) {
        iconMap[p.id] = p.productIcon;
      }
      setProductIcons(iconMap);
      const userStock = data.filter((s) => {
        const userMatch = s.userId === user?.id;
        const buMatch = s.buId === selectedBU?.id;
        const awsMatch = s.awsId === selectedAWS?.id;
        return userMatch && buMatch && awsMatch;
      });
      setStock(userStock);
    } catch (err) {
      console.error('[StockOverview] loadStock error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStock();
  };

  const filtered = search.trim()
    ? stock.filter((s) =>
        s.productName.toLowerCase().includes(search.toLowerCase()) ||
        s.productCode.toLowerCase().includes(search.toLowerCase())
      )
    : stock;

  const totalValue = stock.reduce((sum, s) => sum + s.currentStock * s.price, 0);
  const totalItems = stock.reduce((sum, s) => sum + s.currentStock, 0);
  const lowStockItems = stock.filter((s) => s.currentStock < 30);

  const getStockStatus = (item: StockSchema): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (item.currentStock <= 0) return 'out_of_stock';
    if (item.currentStock < 30) return 'low_stock';
    return 'in_stock';
  };

  const getUsagePercent = (item: StockSchema) => {
    if (item.openingStock <= 0) return 0;
    return (item.openingStock - item.currentStock) / item.openingStock;
  };

  const getProductIcon = (item: StockSchema) => {
    return productIcons[item.productId] || '📦';
  };

  const formatKHR = (amount: number) => {
    return '៛ ' + Math.round(amount).toLocaleString();
  };

  const formatUSD = (amount: number) => {
    return '$ ' + (amount / KHR_RATE).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const navigateToSale = (item: StockSchema) => {
    (navigation as any).navigate('Routes', { screen: 'RoutePlan' });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <Text style={styles.headerTitle}>Stock Inventory</Text>
        <Text style={styles.headerSub}>
          {totalItems} items • {formatKHR(totalValue)} | {formatUSD(totalValue)}
        </Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{stock.length}</Text>
          <Text style={styles.statLabel}>SKUs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalItems}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: lowStockItems.length > 0 ? colors.warning : colors.success }]}>
            {lowStockItems.length}
          </Text>
          <Text style={styles.statLabel}>Low Stock</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search product name or code..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.skeletonRow}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} lines={3} />
            ))}
          </View>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search ? 'No Results' : 'No Stock'}
            subtitle={search ? 'Try a different search term' : 'No inventory items available'}
            icon="📦"
          />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
            renderItem={({ item, index }) => {
              const status = getStockStatus(item);
              const statusColor = status === 'in_stock' ? colors.success : status === 'low_stock' ? colors.warning : colors.error;
              const usage = getUsagePercent(item);
              const icon = getProductIcon(item);

              return (
                <GlassCard animate delay={index * 60}>
                  <View style={styles.stockCard}>
                    <View style={styles.stockTop}>
                      <View style={styles.stockLeft}>
                        <View style={styles.imageBox}>
                          <Text style={styles.productImage}>{icon}</Text>
                        </View>
                        <View style={styles.stockInfo}>
                          <Text style={styles.productName}>{item.productName}</Text>
                          <Text style={styles.productCode}>{item.productCode}</Text>
                        </View>
                      </View>
                      <View style={styles.priceCol}>
                        <Text style={styles.priceKHR}>{formatKHR(item.price)}</Text>
                        <Text style={styles.priceUSD}>{formatUSD(item.price)}</Text>
                      </View>
                    </View>

                    <View style={styles.stockDetail}>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Opening</Text>
                        <Text style={styles.detailValue}>{item.openingStock} {item.unit}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Current</Text>
                        <Text style={[styles.detailValue, { color: statusColor, fontWeight: '700' }]}>
                          {item.currentStock} {item.unit}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Used</Text>
                        <Text style={styles.detailValue}>{item.openingStock - item.currentStock} {item.unit}</Text>
                      </View>
                    </View>

                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${Math.min(usage * 100, 100)}%`, backgroundColor: usage > 0.7 ? colors.warning : colors.primary }]} />
                    </View>

                    <View style={styles.stockFooter}>
                      <StatusBadge
                        status={status === 'in_stock' ? 'active' : status === 'low_stock' ? 'pending' : 'cancelled'}
                        size="sm"
                      />
                      {/* <AnimatedButton
                        title="+ Add to Sale"
                        onPress={() => navigateToSale(item)}
                        variant="secondary"
                        size="sm"
                        disabled={item.currentStock <= 0}
                      /> */}
                    </View>
                  </View>
                </GlassCard>
              );
            }}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  clearBtn: {
    fontSize: 18,
    color: colors.textMuted,
    padding: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  skeletonRow: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.huge,
  },
  stockCard: {
    gap: spacing.sm,
  },
  stockTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  imageBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    fontSize: 26,
  },
  stockInfo: {
    flex: 1,
  },
  productName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 14,
  },
  productCode: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 1,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceKHR: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 14,
  },
  priceUSD: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 1,
  },
  stockDetail: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stockFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
