import 'react-native-gesture-handler';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
    <DebtProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </DebtProvider>
    </SafeAreaProvider>
  );
}
