import React from 'react';
import { render, act } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtProvider } from '../src/context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const mockNavigate = jest.fn();

describe('HomeScreen', () => {
  it('renders correctly and displays initial state', async () => {
    const { getByText, getByTestId } = render(
      <SafeAreaProvider>
        <PaperProvider>
          <DebtProvider>
            <HomeScreen navigation={{ navigate: mockNavigate }} />
          </DebtProvider>
        </PaperProvider>
      </SafeAreaProvider>
    );

    await act(async () => {
      await Promise.resolve(); // wait for AsyncStorage load
    });

    // Check header
    expect(getByText('Mis Deudas')).toBeTruthy();

    // Check total
    expect(getByText('Total Pendiente')).toBeTruthy();

    // Check empty list text
    expect(getByText('No hay deudas registradas.')).toBeTruthy();

    // Check FAB
    expect(getByTestId('fab')).toBeTruthy();
  });
});
