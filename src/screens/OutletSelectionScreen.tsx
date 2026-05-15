import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { OutletProgress } from '../components/OutletProgress';
import { AnimatedButton } from '../components/AnimatedButton';
import { EmptyState } from '../components/EmptyState';
import { RoutesStackParamList } from '../navigation/types';
import type { OutletSchema, SaleSchema } from '../database/schema';
import { mockApi } from '../services/mockApi';

type OutletSelectionNavProp = StackNavigationProp<RoutesStackParamList, 'OutletSelection'>;
type OutletSelectionRouteProp = RouteProp<RoutesStackParamList, 'OutletSelection'>;

export function OutletSelectionScreen() {
  const navigation = useNavigation<OutletSelectionNavProp>();
  const route = useRoute<OutletSelectionRouteProp>();
  const { route: routeData } = route.params;
  const [outlets, setOutlets] = useState<(OutletSchema & { visitStatus: string; saleTotal?: number })[]>([]);
  const [sales, setSales] = useState<SaleSchema[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allOutlets = await mockApi.outlets.getByBU('');
    const routeOutlets = allOutlets.filter((o) => routeData.outletIds.includes(o.id));
    const routeSales = await mockApi.sales.getByRoute(routeData.id);

    const enriched = routeOutlets.map((o) => {
      const outletSales = routeSales.filter((s) => s.outletId === o.id);
      const latestSale = outletSales[outletSales.length - 1];
      return {
        ...o,
        visitStatus: latestSale ? latestSale.visitStatus : 'pending',
        saleTotal: latestSale ? latestSale.total : undefined,
      };
    });

    setOutlets(enriched);
    setSales(routeSales);
  };

  const getOutletProgress = (outlet: typeof outlets[0]) => {
    switch (outlet.visitStatus) {
      case 'checked_out': return 1;
      case 'sale_completed': return 0.8;
      case 'checked_in': return 0.3;
      default: return 0;
    }
  };

  const handleSelectOutlet = (outlet: typeof outlets[0]) => {
    if (outlet.visitStatus === 'pending' || outlet.visitStatus === 'checked_in') {
      navigation.navigate('CheckIn', { outlet, route: routeData });
    } else if (outlet.visitStatus === 'sale_completed') {
      navigation.navigate('CheckOut', { outlet, route: routeData });
    } else if (outlet.visitStatus === 'checked_out') {
      navigation.navigate('CheckIn', { outlet, route: routeData });
    }
  };

  const visitedCount = outlets.filter((o) => o.visitStatus !== 'pending').length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{routeData.name}</Text>
        <Text style={styles.headerSub}>
          {visitedCount}/{outlets.length} outlets completed
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {outlets.length === 0 ? (
          <EmptyState title="No Outlets" subtitle="This route has no assigned outlets" icon="🏪" />
        ) : (
          <FlatList
            data={outlets}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => handleSelectOutlet(item)} activeOpacity={0.9}>
                <GlassCard animate delay={index * 80}>
                  <View style={styles.outletCard}>
                    <View style={styles.outletTop}>
                      <View style={styles.outletInfo}>
                        <Text style={styles.outletName}>{item.name}</Text>
                        <Text style={styles.outletCode}>{item.code}</Text>
                      </View>
                      <StatusBadge status={item.visitStatus} size="sm" />
                    </View>
                    <Text style={styles.outletAddress} numberOfLines={1}>{item.address}</Text>
                    <View style={styles.outletMeta}>
                      <Text style={styles.metaItem}>{item.type}</Text>
                      <View style={styles.metaDot} />
                      <Text style={styles.metaItem}>Tier {item.tier}</Text>
                      {item.saleTotal && (
                        <>
                          <View style={styles.metaDot} />
                          <Text style={[styles.metaItem, styles.saleAmount]}>
                            Rp {item.saleTotal.toLocaleString()}
                          </Text>
                        </>
                      )}
                    </View>
                    <OutletProgress
                      name=""
                      code=""
                      status={item.visitStatus}
                      progress={getOutletProgress(item)}
                    />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            )}
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
  list: {
    gap: spacing.md,
    paddingBottom: spacing.huge,
  },
  outletCard: {
    gap: spacing.sm,
  },
  outletTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  outletAddress: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  outletMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaItem: {
    ...typography.small,
    color: colors.textMuted,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textMuted,
  },
  saleAmount: {
    color: colors.primary,
    fontWeight: '600',
  },
});
