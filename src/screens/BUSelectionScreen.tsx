import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

export function BUSelectionScreen({ navigation, route }: Props) {
  const [bus, setBus] = useState<BusinessUnitSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { selectBU } = useAuth();

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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Select Business Unit</Text>
        <Text style={styles.headerSub}>Choose your working area</Text>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : error ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={loadBusinessUnits} activeOpacity={0.8}>
              <View style={styles.retryBtn}>
                <Text style={styles.retryText}>Retry</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : bus.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.errorIcon}>🏢</Text>
            <Text style={styles.errorTitle}>No Business Units</Text>
            <Text style={styles.errorSub}>No business units available for this session</Text>
          </View>
        ) : (
          <FlatList
            data={bus}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                activeOpacity={0.9}
              >
                <GlassCard animate delay={index * 100}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardLeft}>
                      <View style={styles.iconBox}>
                        <Text style={styles.buIcon}>🏢</Text>
                      </View>
                      <View>
                        <Text style={styles.buName}>{item.name}</Text>
                        <Text style={styles.buCode}>{item.code}</Text>
                        <Text style={styles.buRegion}>{item.region}</Text>
                      </View>
                    </View>
                    <Text style={styles.arrow}>›</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  loader: {
    marginTop: spacing.huge,
  },
  list: {
    paddingVertical: spacing.lg,
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
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buIcon: {
    fontSize: 24,
  },
  buName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  buCode: {
    ...typography.caption,
    color: colors.textMuted,
  },
  buRegion: {
    ...typography.small,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 28,
    color: colors.textMuted,
    fontWeight: '300',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  errorSub: {
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
