import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/context/DebtContext';
import { ThemeProvider } from 'react-native-paper';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

describe('HomeScreen', () => {
  it('renders correctly with empty debts', () => {
    const mockContext = { debts: [], isLoaded: true };
    const { getByText } = render(
      <DebtContext.Provider value={mockContext}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    expect(getByText('No tienes deudas activas.')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });

  it('renders active debts and correct total', () => {
    const mockContext = {
      debts: [
        { id: '1', description: 'Debt 1', amount: 100.5, type: 'Otro', isPaid: false },
        { id: '2', description: 'Debt 2', amount: 50, type: 'Tarjeta', isPaid: true },
        { id: '3', description: 'Debt 3', amount: 200.25, type: 'Crédito', isPaid: false }
      ],
      isLoaded: true
    };

    const { getByText, queryByText } = render(
      <DebtContext.Provider value={mockContext}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    expect(getByText('$300.75')).toBeTruthy();
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 3')).toBeTruthy();
    expect(queryByText('Debt 2')).toBeNull();
  });
});
