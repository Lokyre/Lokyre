import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { DebtContext } from '../context/DebtContext';

const mockNavigation = {
  navigate: jest.fn(),
};

const mockDebts = [
  { id: '1', name: 'Deuda 1', amount: 100, type: 'tarjeta', isPaid: false },
  { id: '2', name: 'Deuda 2', amount: 50, type: 'persona', isPaid: true },
];

describe('HomeScreen', () => {
  it('renders debts and total amount correctly', () => {
    const { getByText, getByTestId } = render(
      <DebtContext.Provider value={{ debts: mockDebts }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    expect(getByText('Deuda 1')).toBeTruthy();
    expect(getByText('Deuda 2')).toBeTruthy();
    expect(getByText('Total a Pagar: $100.00')).toBeTruthy();
  });

  it('navigates to AddDebtScreen on FAB press', async () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [] }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    await act(async () => {
      fireEvent.press(getByTestId('fab'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });
});
