import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { AuthStackParamList } from '../navigation/types';
import type { BusinessUnitSchema } from '../database/schema';

type BUSelectionNavProp = StackNavigationProp<AuthStackParamList, 'BUSelection'>;

interface Props {
  navigation: BUSelectionNavProp;
  route?: any;
}

const BU_IMAGE_MAP: Record<string, string> = {
  'glass-wine': 'glass-wine',
  'glass-mug-variant': 'glass-mug-variant',
};

export function BUSelectionScreen({ navigation, route }: Props) {
  const [bus, setBus] = useState<BusinessUnitSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { selectBU, logout } = useAuth();

  useEffect(() => {
    loadBusinessUnits();
  }, []);

  const loadBusinessUnits = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await mockApi.businessUnits.getAll();
      setBus(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load business units');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (bu: BusinessUnitSchema) => {
    await selectBU(bu);
    navigation.navigate('AWSSelection', {
      user: route?.params?.user || null,
      businessUnit: bu,
    });
  };

  const getIconName = (bu: BusinessUnitSchema): string => {
    return bu.image ? BU_IMAGE_MAP[bu.image] || 'domain' : 'domain';
  };

  const getIconColor = (bu: BusinessUnitSchema): string => {
    if (bu.image === 'glass-wine') return '#8B0000';
    if (bu.image === 'glass-mug-variant') return '#F5A623';
    return colors.primary;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={logout} style={styles.backBtn}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textInverse} />
          </TouchableOpacity>
          <View style={styles.headerTextCol}>
            <Text style={styles.headerTitle}>Select Business Unit</Text>
            <Text style={styles.headerSub}>Choose your working area</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : error ? (
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadBusinessUnits} activeOpacity={0.8}>
              <View style={styles.retryBtn}>
                <Text style={styles.retryText}>Retry</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : bus.length === 0 ? (
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="domain-off" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Business Units</Text>
            <Text style={styles.emptySub}>No business units available for this session</Text>
          </View>
        ) : (
          <FlatList
            data={bus}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const iconName = getIconName(item);
              const iconColor = getIconColor(item);

              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.9}
                >
                  <GlassCard animate delay={index * 100}>
                    <View style={styles.cardContent}>
                      <View style={styles.cardLeft}>
                        <View style={[styles.iconBox, { backgroundColor: iconColor + '15' }]}>
                          <MaterialCommunityIcons name={iconName as any} size={28} color={iconColor} />
                        </View>
                        <View style={styles.textCol}>
                          <Text style={styles.buName}>{item.name}</Text>
                          <Text style={styles.buCode}>{item.code}</Text>
                          <View style={styles.regionRow}>
                            <MaterialCommunityIcons name="map-marker" size={12} color={colors.textMuted} />
                            <Text style={styles.buRegion}>{item.region}</Text>
                          </View>
                        </View>
                      </View>
                      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMuted} />
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
    paddingTop: spacing.huge + 20,
    paddingBottom: spacing.xxl + 20,
    paddingHorizontal: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerTextCol: {
    flex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: spacing.lg,
    marginTop: -40,
  },
  loader: {
    marginTop: spacing.huge,
  },
  list: {
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
    gap: spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    flex: 1,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  buName: {
    ...typography.h4,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  buCode: {
    ...typography.caption,
    color: colors.textMuted,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  buRegion: {
    ...typography.small,
    color: colors.textSecondary,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  emptySub: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  retryText: {
    ...typography.captionBold,
    color: colors.textInverse,
  },
});
