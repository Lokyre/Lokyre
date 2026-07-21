import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <DebtProvider>
      <PaperProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PaperProvider>
    </DebtProvider>
  );
}
