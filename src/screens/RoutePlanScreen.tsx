import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { AnimatedButton } from '../components/AnimatedButton';
import { EmptyState } from '../components/EmptyState';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { RoutesStackParamList } from '../navigation/types';
import type { RouteSchema, OutletSchema, SaleSchema } from '../database/schema';

type RouteNavProp = StackNavigationProp<RoutesStackParamList, 'RoutePlan'>;

export function RoutePlanScreen() {
  const navigation = useNavigation<RouteNavProp>();
  const { user, selectedBU, selectedAWS } = useAuth();
  const [routes, setRoutes] = useState<(RouteSchema & { outlets: OutletSchema[]; sales: SaleSchema[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (user && selectedBU && selectedAWS) loadRoutes();
    }, [user?.id])
  );

  const loadRoutes = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const routeData = await mockApi.routes.getByUserAndDate(user!.id, today);
      const outlets = await mockApi.outlets.getByBU(selectedBU!.id);
      const sales = await mockApi.sales.getByRoute('');

      const enriched = await Promise.all(
        routeData.map(async (route) => {
          const routeOutlets = outlets.filter((o) => route.outletIds.includes(o.id));
          const routeSales = await mockApi.sales.getByRoute(route.id);
          return { ...route, outlets: routeOutlets, sales: routeSales };
        })
      );
      setRoutes(enriched);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const calculateRouteProgress = (route: typeof routes[0]) => {
    if (route.outlets.length === 0) return 0;
    const visited = route.outlets.filter((o) =>
      route.sales.some((s) => s.outletId === o.id)
    ).length;
    return visited / route.outlets.length;
  };

  const handleSelectRoute = (route: typeof routes[0]) => {
    navigation.navigate('OutletSelection', { route });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <Text style={styles.headerTitle}>Route Plan</Text>
        <Text style={styles.headerSub}>Today's visit schedule</Text>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : routes.length === 0 ? (
          <EmptyState title="No Routes Today" subtitle="Your route plan is empty" icon="🗺️" />
        ) : (
          <FlatList
            data={routes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const progress = calculateRouteProgress(item);
              const visitCount = item.outlets.filter((o) =>
                item.sales.some((s) => s.outletId === o.id)
              ).length;

              return (
                <TouchableOpacity onPress={() => handleSelectRoute(item)} activeOpacity={0.9}>
                  <GlassCard animate delay={index * 100}>
                    <View style={styles.routeCard}>
                      <View style={styles.routeTop}>
                        <View style={styles.routeInfo}>
                          <Text style={styles.routeName}>{item.name}</Text>
                          <Text style={styles.routeCode}>{item.code}</Text>
                        </View>
                        <StatusBadge status={item.status} size="sm" />
                      </View>

                      <View style={styles.routeStats}>
                        <View style={styles.routeStat}>
                          <Text style={styles.statNum}>{item.outlets.length}</Text>
                          <Text style={styles.statLbl}>Outlets</Text>
                        </View>
                        <View style={styles.statDiv} />
                        <View style={styles.routeStat}>
                          <Text style={styles.statNum}>{visitCount}</Text>
                          <Text style={styles.statLbl}>Visited</Text>
                        </View>
                        <View style={styles.statDiv} />
                        <View style={styles.routeStat}>
                          <Text style={styles.statNum}>{item.outlets.length - visitCount}</Text>
                          <Text style={styles.statLbl}>Remaining</Text>
                        </View>
                      </View>

                      <ProgressBar progress={progress} />
                      <Text style={styles.progressText}>
                        {Math.round(progress * 100)}% complete
                      </Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  loader: {
    marginTop: spacing.huge,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.huge,
  },
  routeCard: {
    gap: spacing.md,
  },
  routeTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  routeCode: {
    ...typography.caption,
    color: colors.textMuted,
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
  },
  routeStat: {
    flex: 1,
    alignItems: 'center',
  },
  statDiv: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
  },
  statNum: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  statLbl: {
    ...typography.small,
    color: colors.textMuted,
  },
  progressText: {
    ...typography.small,
    color: colors.textMuted,
    textAlign: 'right',
  },
});
