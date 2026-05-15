import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { GlassCard } from '../components/GlassCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { RoutesStackParamList } from '../navigation/types';

type CheckInNavProp = StackNavigationProp<RoutesStackParamList, 'CheckIn'>;
type CheckInRouteProp = RouteProp<RoutesStackParamList, 'CheckIn'>;

export function CheckInScreen() {
  const navigation = useNavigation<CheckInNavProp>();
  const route = useRoute<CheckInRouteProp>();
  const { outlet, route: routeData } = route.params;
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const currentTime = new Date().toLocaleTimeString('en-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const currentDate = new Date().toLocaleDateString('en-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleCheckIn = () => {
    setCheckingIn(true);
    setTimeout(() => {
      setCheckingIn(false);
      setCheckedIn(true);
    }, 1500);
  };

  const handleContinue = () => {
    navigation.navigate('LoadPrograms', { outlet, route: routeData });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-In</Text>
        <Text style={styles.headerSub}>{outlet.name}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <GlassCard>
          <View style={styles.outletHeader}>
            <View style={styles.outletIconBox}>
              <Text style={styles.outletIcon}>🏪</Text>
            </View>
            <View style={styles.outletInfo}>
              <Text style={styles.outletName}>{outlet.name}</Text>
              <Text style={styles.outletCode}>{outlet.code}</Text>
              <Text style={styles.outletAddress}>{outlet.address}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact</Text>
            <Text style={styles.detailValue}>{outlet.contactName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{outlet.contactPhone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{outlet.type} • Tier {outlet.tier}</Text>
          </View>
        </GlassCard>

        <GlassCard style={styles.timeCard}>
          <View style={styles.timeRow}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Date</Text>
              <Text style={styles.timeValue}>{currentDate}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Time</Text>
              <Text style={styles.timeValue}>{currentTime}</Text>
            </View>
          </View>
        </GlassCard>

        {checkedIn ? (
          <GlassCard style={styles.successCard}>
            <View style={styles.successContent}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Check-In Successful!</Text>
              <Text style={styles.successSub}>You are now at {outlet.name}</Text>
            </View>
          </GlassCard>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {checkedIn ? (
          <AnimatedButton title="Continue to Programs →" onPress={handleContinue} fullWidth />
        ) : (
          <AnimatedButton
            title={checkingIn ? 'Checking In...' : '📍 Check-In Now'}
            onPress={handleCheckIn}
            loading={checkingIn}
            disabled={checkingIn}
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
  outletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  outletIconBox: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outletIcon: {
    fontSize: 28,
  },
  outletInfo: {
    flex: 1,
  },
  outletName: {
    ...typography.h4,
    color: colors.textPrimary,
  },
  outletCode: {
    ...typography.caption,
    color: colors.textMuted,
  },
  outletAddress: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  detailValue: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  timeCard: {
    marginTop: spacing.md,
  },
  timeRow: {
    gap: spacing.md,
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  timeValue: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  successCard: {
    marginTop: spacing.md,
    backgroundColor: colors.primaryFaded,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  successContent: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  successIcon: {
    fontSize: 36,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: spacing.sm,
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
