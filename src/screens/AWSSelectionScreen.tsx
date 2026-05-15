import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { AuthStackParamList } from '../navigation/types';
import type { AWSSchema } from '../database/schema';

type AWSSelectionNavProp = StackNavigationProp<AuthStackParamList, 'AWSSelection'>;

interface Props {
  navigation: AWSSelectionNavProp;
  route: any;
}

export function AWSSelectionScreen({ navigation, route }: Props) {
  const [awsList, setAwsList] = useState<AWSSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectAWS } = useAuth();
  const bu = route?.params?.businessUnit;
  const user = route?.params?.user;

  useEffect(() => {
    if (bu) loadAWS(bu.id);
  }, [bu]);

  const loadAWS = async (buId: string) => {
    try {
      const data = await mockApi.aws.getByBU(buId);
      setAwsList(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (aws: AWSSchema) => {
    await selectAWS(aws);
    navigation.navigate('OpenStock', { user, businessUnit: bu, aws });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Select AWS Period</Text>
        <Text style={styles.headerSub}>{bu?.name} • Choose working period</Text>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={awsList}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => handleSelect(item)} activeOpacity={0.9}>
                <GlassCard animate delay={index * 100}>
                  <View style={styles.cardContent}>
                    <View style={styles.cardTop}>
                      <View style={styles.iconBox}>
                        <Text style={styles.awsIcon}>📅</Text>
                      </View>
                      <View style={styles.info}>
                        <Text style={styles.awsName}>{item.name}</Text>
                        <Text style={styles.awsCode}>{item.code}</Text>
                        <View style={styles.dateRow}>
                          <Text style={styles.dateLabel}>{item.startDate}</Text>
                          <Text style={styles.dateSep}>→</Text>
                          <Text style={styles.dateLabel}>{item.endDate}</Text>
                        </View>
                      </View>
                      <StatusBadge status={item.isActive ? 'active' : 'pending'} size="sm" />
                    </View>
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
    gap: spacing.md,
  },
  cardTop: {
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
  awsIcon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  awsName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  awsCode: {
    ...typography.caption,
    color: colors.textMuted,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dateLabel: {
    ...typography.small,
    color: colors.textSecondary,
  },
  dateSep: {
    ...typography.small,
    color: colors.textMuted,
  },
});
