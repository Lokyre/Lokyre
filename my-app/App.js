import 'react-native-get-random-values';
import React from 'react';
import { DebtProvider } from './src/context/DebtContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <DebtProvider>
      <AppNavigator />
    </DebtProvider>
  );
}
