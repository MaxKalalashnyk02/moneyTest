import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import {ThemeProvider, useTheme} from './src/contexts/ThemeContext';
import {AuthProvider} from './src/contexts/AuthContext';

enableScreens();

const AppContent = () => {
  const {isDark} = useTheme();
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};

function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
