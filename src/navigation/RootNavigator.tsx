import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthStack from './stacks/AuthStack';
import MainStack from './stacks/MainStack';
import {useAuth} from '../contexts/AuthContext';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const SCREEN_NAMES = {
  AUTH: 'Auth',
  MAIN: 'Main',
} as const;

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const {user} = useAuth();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {user ? (
        <Stack.Screen name={SCREEN_NAMES.MAIN} component={MainStack} />
      ) : (
        <Stack.Screen name={SCREEN_NAMES.AUTH} component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
