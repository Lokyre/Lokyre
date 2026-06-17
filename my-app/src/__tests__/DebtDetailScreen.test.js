import 'react-native-gesture-handler/jestSetup';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import DebtDetailScreen from '../screens/DebtDetailScreen';
import { DebtContext } from '../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: { id: '1' },
    }),
  };
});

describe('DebtDetailScreen', () => {
  it('renders debt details and toggles paid status', async () => {
    const mockMarkAsPaid = jest.fn();
    const mockDebts = [
      { id: '1', title: 'Test Debt', amount: 100, type: 'Tarjeta', isPaid: false, description: 'Test desc' },
    ];

    const { getByText } = render(
      <SafeAreaProvider>
        <NavigationContainer>
          <DebtContext.Provider value={{ debts: mockDebts, markAsPaid: mockMarkAsPaid }}>
            <DebtDetailScreen />
          </DebtContext.Provider>
        </NavigationContainer>
      </SafeAreaProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Test desc')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Marcar como Pagado'));
    });

    expect(mockMarkAsPaid).toHaveBeenCalledWith('1', true);
  });
});
