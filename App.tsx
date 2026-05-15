import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, typography } from './src/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { seedDatabase } from './src/mock/seed';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await seedDatabase();
      } catch (e) {
        console.warn('Init error:', e);
      }
      setReady(true);
    }
    init();
  }, []);

  if (!ready) {
    return (
      <View style={styles.splash}>
        <Text style={styles.logo}>◆</Text>
        <Text style={styles.appName}> SFA</Text>
        <ActivityIndicator size="large" color={colors.textInverse} style={styles.loader} />
        <Text style={styles.loadingText}>Preparing your workspace...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 60,
    color: colors.textInverse,
    marginBottom: 16,
  },
  appName: {
    ...typography.h1,
    color: colors.textInverse,
    marginBottom: 32,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
});
