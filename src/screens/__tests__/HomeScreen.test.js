import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtContext } from '../../context/DebtContext';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ navigate: mockNavigate }),
  };
});

const mockDebts = [
  { id: '1', title: 'Debt 1', amount: 100, type: 'persona', isPaid: false },
  { id: '2', title: 'Debt 2', amount: 200, type: 'tarjeta', isPaid: true },
];

describe('HomeScreen', () => {
  it('renders pending debts by default', () => {
    const { getByText, queryByText } = render(
      <DebtContext.Provider value={{ debts: mockDebts, loading: false }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    expect(getByText('Total Pendiente: $100.00')).toBeTruthy();
    expect(getByText('Debt 1')).toBeTruthy();
    expect(queryByText('Debt 2')).toBeNull();
  });

  it('filters paid debts', () => {
    const { getByText, getByTestId } = render(
      <DebtContext.Provider value={{ debts: mockDebts, loading: false }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('filter-paid'));

    expect(getByText('Total Pagado: $200.00')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
  });

  it('navigates to AddDebt on FAB press', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: mockDebts, loading: false }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('add-debt-fab'));
    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });

  it('navigates to DebtDetail on card press', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: mockDebts, loading: false }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('debt-item-1'));
    expect(mockNavigate).toHaveBeenCalledWith('DebtDetail', { debtId: '1' });
  });
});
