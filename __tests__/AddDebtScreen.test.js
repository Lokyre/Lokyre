import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { DebtProvider } from '../src/context/DebtContext';
import AddDebtScreen from '../src/screens/AddDebtScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

describe('AddDebtScreen', () => {
  it('renders correctly', async () => {
    render(
      <SafeAreaProvider>
        <DebtProvider>
          <PaperProvider>
            <NavigationContainer>
              <AddDebtScreen />
            </NavigationContainer>
          </PaperProvider>
        </DebtProvider>
      </SafeAreaProvider>
    );

    expect(screen.getByTestId('titleInput')).toBeTruthy();
    expect(screen.getByTestId('amountInput')).toBeTruthy();
    expect(screen.getByTestId('submitButton')).toBeTruthy();
  });
});
