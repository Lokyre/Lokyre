import 'react-native-gesture-handler/jestSetup';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('HomeScreen', () => {
  it('renders correctly with no debts', async () => {
    const { getByText } = render(
      <SafeAreaProvider>
        <NavigationContainer>
          <DebtContext.Provider value={{ debts: [], loading: false }}>
            <HomeScreen />
          </DebtContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('No tienes deudas registradas.')).toBeTruthy();
  });

  it('renders a list of debts', async () => {
    const mockDebts = [
      { id: '1', title: 'Test Debt', amount: 100, type: 'Tarjeta', isPaid: false, dueDate: '2023-12-31' },
    ];

    const { getByTestId, getByText } = render(
      <SafeAreaProvider>
        <NavigationContainer>
          <DebtContext.Provider value={{ debts: mockDebts, loading: false }}>
            <HomeScreen />
          </DebtContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debt-title-1')).toBeTruthy();
    expect(getByText('$100')).toBeTruthy();
  });
});
