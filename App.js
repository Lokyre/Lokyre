import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from './src/context/DebtContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <DebtProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </DebtProvider>
  );
}
