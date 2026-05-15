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
import { AnimatedButton } from '../components/AnimatedButton';
import { EmptyState } from '../components/EmptyState';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import { RoutesStackParamList } from '../navigation/types';
import type { ProgramSchema } from '../database/schema';

type LoadProgramsNavProp = StackNavigationProp<RoutesStackParamList, 'LoadPrograms'>;
type LoadProgramsRouteProp = RouteProp<RoutesStackParamList, 'LoadPrograms'>;

export function LoadProgramsScreen() {
  const navigation = useNavigation<LoadProgramsNavProp>();
  const route = useRoute<LoadProgramsRouteProp>();
  const { outlet, route: routeData } = route.params;
  const { selectedBU } = useAuth();
  const [programs, setPrograms] = useState<ProgramSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const data = await mockApi.programs.getByOutlet(outlet.id, selectedBU!.id);
      setPrograms(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const toggleProgram = (id: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const activePrograms = programs.filter((p) => selectedPrograms.includes(p.id));

  const handleContinue = () => {
    navigation.navigate('CreateSale', {
      outlet,
      route: routeData,
      programs: activePrograms,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'discount': return '🏷️';
      case 'promo': return '🎁';
      case 'cashback': return '💵';
      default: return '📋';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Outlet Programs</Text>
        <Text style={styles.headerSub}>{outlet.name} • Available promotions</Text>
      </LinearGradient>

      <View style={styles.content}>
        {loading ? null : programs.length === 0 ? (
          <EmptyState title="No Programs" subtitle="No active programs for this outlet" icon="🎯" />
        ) : (
          <FlatList
            data={programs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const isSelected = selectedPrograms.includes(item.id);
              return (
                <TouchableOpacity onPress={() => toggleProgram(item.id)} activeOpacity={0.9}>
                  <GlassCard
                    animate
                    delay={index * 80}
                    style={isSelected ? styles.selectedCard : undefined}
                  >
                    <View style={styles.programCard}>
                      <View style={styles.programTop}>
                        <View style={styles.programLeft}>
                          <Text style={styles.programIcon}>{getTypeIcon(item.type)}</Text>
                          <View style={styles.programInfo}>
                            <Text style={styles.programName}>{item.name}</Text>
                            <Text style={styles.programCode}>{item.code}</Text>
                          </View>
                        </View>
                        <View style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}>
                          {isSelected && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                      </View>
                      <Text style={styles.programDesc}>{item.description}</Text>
                      <View style={styles.programMeta}>
                        <StatusBadge status={item.type} size="sm" />
                        <Text style={styles.programDiscount}>
                          {item.discountType === 'percentage'
                            ? `${item.discountValue}% OFF`
                            : `Rp ${item.discountValue.toLocaleString()} OFF`}
                        </Text>
                      </View>
                      {item.minPurchase > 0 && (
                        <Text style={styles.minPurchase}>
                          Min. purchase: Rp {item.minPurchase.toLocaleString()}
                        </Text>
                      )}
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>{selectedPrograms.length} program(s) selected</Text>
        </View>
        <AnimatedButton
          title={`Create Sale →`}
          onPress={handleContinue}
          disabled={selectedPrograms.length === 0}
          fullWidth
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
  list: {
    gap: spacing.md,
    paddingBottom: spacing.huge,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  programCard: {
    gap: spacing.sm,
  },
  programTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  programIcon: {
    fontSize: 24,
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  programCode: {
    ...typography.small,
    color: colors.textMuted,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
  programDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  programMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  programDiscount: {
    ...typography.captionBold,
    color: colors.accent,
  },
  minPurchase: {
    ...typography.small,
    color: colors.textMuted,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  footerInfo: {
    alignItems: 'center',
  },
  footerLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
