import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';

import { AuthStackParamList, MainTabParamList, RoutesStackParamList, StockStackParamList, SalesStackParamList, MoreStackParamList } from './types';
import { useAuth } from '../hooks/useAuth';

// Screens
import { LoginScreen } from '../screens/LoginScreen';
import { BUSelectionScreen } from '../screens/BUSelectionScreen';
import { AWSSelectionScreen } from '../screens/AWSSelectionScreen';
import { OpenStockScreen } from '../screens/OpenStockScreen';
import { StartSessionScreen } from '../screens/StartSessionScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { RoutePlanScreen } from '../screens/RoutePlanScreen';
import { OutletSelectionScreen } from '../screens/OutletSelectionScreen';
import { CheckInScreen } from '../screens/CheckInScreen';
import { LoadProgramsScreen } from '../screens/LoadProgramsScreen';
import { CreateSaleScreen } from '../screens/CreateSaleScreen';
import { CheckOutScreen } from '../screens/CheckOutScreen';
import { SettlementScreen } from '../screens/SettlementScreen';
import { CloseSessionScreen } from '../screens/CloseSessionScreen';
import { StockOverviewScreen } from '../screens/StockOverviewScreen';

const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const RoutesStack = createStackNavigator<RoutesStackParamList>();
const StockStack = createStackNavigator<StockStackParamList>();
const SalesStack = createStackNavigator<SalesStackParamList>();
const MoreStack = createStackNavigator<MoreStackParamList>();

const tabIcons: Record<string, string> = {
  Dashboard: '📊',
  Routes: '📍',
  Sales: '💰',
  Stock: '📦',
  More: '⚙️',
};

function TabIcon({ routeName, focused }: { routeName: string; focused: boolean }) {
  return (
    <View style={[tabStyles.iconContainer, focused && tabStyles.activeIcon]}>
      <Text style={[tabStyles.icon, focused && tabStyles.activeIconText]}>
        {tabIcons[routeName] || '•'}
      </Text>
    </View>
  );
}

function TabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.inner}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const icon = tabIcons[route.name] || '•';

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={tabStyles.tab}
              activeOpacity={0.7}
            >
              <View style={[tabStyles.iconWrap, isFocused && tabStyles.activeTab]}>
                <Text style={[tabStyles.tabIcon, isFocused && tabStyles.activeTabIcon]}>
                  {icon}
                </Text>
              </View>
              <Text style={[tabStyles.tabLabel, isFocused && tabStyles.activeTabLabel]}>
                {route.name}
              </Text>
              {isFocused && <View style={tabStyles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 0,
  },
  inner: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    position: 'relative',
  },
  iconWrap: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  activeTab: {
    backgroundColor: colors.primaryFaded,
  },
  tabIcon: {
    fontSize: 20,
  },
  activeTabIcon: {},
  tabLabel: {
    ...typography.small,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    width: 20,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIcon: {},
  icon: { fontSize: 20 },
  activeIconText: {},
});

function DashboardScreenWrapper() {
  return <DashboardScreen />;
}

function RoutesScreenWrapper() {
  const RoutesStackNav = () => (
    <RoutesStack.Navigator screenOptions={{ headerShown: false }}>
      <RoutesStack.Screen name="RoutePlan" component={RoutePlanScreen} />
      <RoutesStack.Screen name="OutletSelection" component={OutletSelectionScreen} />
      <RoutesStack.Screen name="CheckIn" component={CheckInScreen} />
      <RoutesStack.Screen name="LoadPrograms" component={LoadProgramsScreen} />
      <RoutesStack.Screen name="CreateSale" component={CreateSaleScreen} />
      <RoutesStack.Screen name="CheckOut" component={CheckOutScreen} />
    </RoutesStack.Navigator>
  );
  return <RoutesStackNav />;
}

function SalesScreenWrapper() {
  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}

function StockScreenWrapper() {
  return (
    <StockStack.Navigator screenOptions={{ headerShown: false }}>
      <StockStack.Screen name="StockOverview" component={StockOverviewScreen} />
    </StockStack.Navigator>
  );
}

function MoreScreenWrapper() {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="Settlement" component={SettlementScreen} />
      <MoreStack.Screen name="CloseSession" component={CloseSessionScreen} />
    </MoreStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreenWrapper} />
      <Tab.Screen name="Routes" component={RoutesScreenWrapper} />
      <Tab.Screen name="Sales" component={SalesScreenWrapper} />
      <Tab.Screen name="Stock" component={StockScreenWrapper} />
      <Tab.Screen name="More" component={MoreScreenWrapper} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, user, selectedBU, selectedAWS } = useAuth();

  if (!isAuthenticated) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="BUSelection" component={BUSelectionScreen} />
        <AuthStack.Screen name="AWSSelection" component={AWSSelectionScreen} />
        <AuthStack.Screen name="OpenStock" component={OpenStockScreen} />
        <AuthStack.Screen name="StartSession" component={StartSessionScreen} />
      </AuthStack.Navigator>
    );
  }

  if (user && !selectedBU) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="BUSelection" component={BUSelectionScreen} />
      </AuthStack.Navigator>
    );
  }

  if (user && selectedBU && !selectedAWS) {
    return (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="AWSSelection" component={AWSSelectionScreen} />
      </AuthStack.Navigator>
    );
  }

  if (user && selectedBU && selectedAWS) {
    return <MainTabs />;
  }

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}
