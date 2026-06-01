import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DebtContext } from '../context/DebtContext';
import HomeScreen from './HomeScreen';
import { Provider as PaperProvider } from 'react-native-paper';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('HomeScreen', () => {
  it('renders loading indicator initially', () => {
    const { UNSAFE_getByType } = render(
      <DebtContext.Provider value={{ debts: [], loading: true }}>
        <PaperProvider>
          <NavigationContainer>
            <HomeScreen />
          </NavigationContainer>
        </PaperProvider>
      </DebtContext.Provider>
    );

    const { ActivityIndicator } = require('react-native-paper');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders list of debts and total amount', () => {
    const mockDebts = [
      { id: '1', title: 'Tarjeta Visa', amount: '1500', isPaid: false, dueDate: '2024-12-01' },
      { id: '2', title: 'Préstamo Auto', amount: '3000', isPaid: true, dueDate: '2024-11-15' },
    ];

    const { getByText } = render(
      <DebtContext.Provider value={{ debts: mockDebts, loading: false }}>
        <PaperProvider>
          <NavigationContainer>
            <HomeScreen />
          </NavigationContainer>
        </PaperProvider>
      </DebtContext.Provider>
    );

    expect(getByText('$1500.00')).toBeTruthy(); // Total amount for unpaid debts
    expect(getByText('Tarjeta Visa')).toBeTruthy();
    expect(getByText('Préstamo Auto')).toBeTruthy();
  });

  it('navigates to AddDebt screen when FAB is pressed', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [], loading: false }}>
        <PaperProvider>
          <NavigationContainer>
            <HomeScreen />
          </NavigationContainer>
        </PaperProvider>
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });
});
