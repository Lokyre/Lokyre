import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DebtProvider } from './src/context/DebtContext';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    error: '#B00020',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <DebtProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </DebtProvider>
    </SafeAreaProvider>
  );
}
