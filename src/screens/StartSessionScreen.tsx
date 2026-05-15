import React from 'react';
import {
  View, Text, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { AnimatedButton } from '../components/AnimatedButton';
import { AuthStackParamList } from '../navigation/types';

type StartSessionNavProp = StackNavigationProp<AuthStackParamList, 'StartSession'>;

interface Props {
  navigation: StartSessionNavProp;
  route: any;
}

export function StartSessionScreen({ navigation, route }: Props) {
  const user = route?.params?.user;
  const bu = route?.params?.businessUnit;
  const aws = route?.params?.aws;

  const handleStart = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary, colors.primaryLight]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>▶</Text>
          </View>
          <Text style={styles.title}>Ready to Start Your Day?</Text>
          <Text style={styles.subtitle}>Begin your daily sales session</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sales Rep</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Unit</Text>
              <Text style={styles.infoValue}>{bu?.name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>AWS Period</Text>
              <Text style={styles.infoValue}>{aws?.code}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {new Date().toLocaleDateString('en-ID', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <AnimatedButton
            title="▶  Start Daily Session"
            onPress={handleStart}
            fullWidth
            size="lg"
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  icon: {
    fontSize: 36,
    color: colors.textInverse,
  },
  title: {
    ...typography.h2,
    color: colors.textInverse,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xxl,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    marginBottom: spacing.xxl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  infoValue: {
    ...typography.captionBold,
    color: colors.textInverse,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
