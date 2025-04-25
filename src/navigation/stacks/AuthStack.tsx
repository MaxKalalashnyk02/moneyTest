import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import WelcomeScreen from '../../screens/Auth/Welcome';
import Login from '../../screens/Auth/Login';
import Signup from '../../screens/Auth/Signup';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

const SCREEN_NAMES = {
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
} as const;

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={SCREEN_NAMES.WELCOME}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={SCREEN_NAMES.WELCOME} component={WelcomeScreen} />
      <Stack.Screen name={SCREEN_NAMES.LOGIN} component={Login} />
      <Stack.Screen name={SCREEN_NAMES.SIGNUP} component={Signup} />
    </Stack.Navigator>
  );
};

export default AuthStack;
