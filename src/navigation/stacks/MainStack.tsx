import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@rneui/themed';

import {useTheme} from '../../contexts/ThemeContext';
import {darkTheme, lightTheme} from '../../theme/colors';
import Summary from '../../screens/Main/Summary';
import Expense from '../../screens/Main/Expense';
import Accounts from '../../screens/Main/Accounts';

export type MainTabParamList = {
  Expenses: undefined;
  Summary: undefined;
  Account: undefined;
};

const SCREEN_NAMES = {
  EXPENSES: 'Expenses',
  SUMMARY: 'Summary',
  ACCOUNT: 'Account',
} as const;

const TAB_ICONS: Record<string, string> = {
  [SCREEN_NAMES.EXPENSES]: 'list',
  [SCREEN_NAMES.SUMMARY]: 'pie-chart',
  [SCREEN_NAMES.ACCOUNT]: 'credit-card',
};

const TAB_TITLES: Record<string, string> = {
  [SCREEN_NAMES.EXPENSES]: 'My Expenses',
  [SCREEN_NAMES.SUMMARY]: 'Summary',
  [SCREEN_NAMES.ACCOUNT]: 'Account',
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const renderTabIcon =
  (routeName: string) =>
  ({color, size}: {color: string; size: number}) => {
    const iconName = TAB_ICONS[routeName] || 'circle';
    return <Icon name={iconName} type="feather" size={size} color={color} />;
  };

const MainStack = () => {
  const {isDark} = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: renderTabIcon(route.name),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.divider,
        },
      })}>
      <Tab.Screen
        name={SCREEN_NAMES.EXPENSES}
        component={Expense}
        options={{title: TAB_TITLES[SCREEN_NAMES.EXPENSES]}}
      />
      <Tab.Screen
        name={SCREEN_NAMES.SUMMARY}
        component={Summary}
        options={{title: TAB_TITLES[SCREEN_NAMES.SUMMARY]}}
      />
      <Tab.Screen
        name={SCREEN_NAMES.ACCOUNT}
        component={Accounts}
        options={{title: TAB_TITLES[SCREEN_NAMES.ACCOUNT]}}
      />
    </Tab.Navigator>
  );
};

export default MainStack;
