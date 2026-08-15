import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';

const mockNavigation = { navigate: jest.fn() };

const renderWithContext = (debts, togglePaid = jest.fn(), deleteDebt = jest.fn()) => {
  return render(
    <DebtContext.Provider value={{ debts, togglePaid, deleteDebt }}>
      <HomeScreen navigation={mockNavigation} />
    </DebtContext.Provider>
  );
};

describe('HomeScreen', () => {
  it('renders correctly with no debts', () => {
    const { getByText } = renderWithContext([]);
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });

  it('renders a list of debts and calculates total', () => {
    const debts = [
      { id: '1', description: 'Debt 1', amount: '100', type: 'Tarjeta', isPaid: false },
      { id: '2', description: 'Debt 2', amount: '50', type: 'Crédito', isPaid: true },
    ];
    const { getByText } = renderWithContext(debts);
    expect(getByText('$100.00')).toBeTruthy();
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Monto: $100 - Tipo: Tarjeta')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
  });

  it('navigates to AddDebt screen when FAB is pressed', () => {
    const { getByTestId } = renderWithContext([]);
    fireEvent.press(getByTestId('add-debt-fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });
});
