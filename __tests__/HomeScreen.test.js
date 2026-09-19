import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/context/DebtContext';

const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  it('renders summary correctly', () => {
    const mockDebts = [
      { id: '1', description: 'Debt 1', amount: 100, category: 'Tarjetas', paid: false },
      { id: '2', description: 'Debt 2', amount: 50, category: 'Créditos', paid: false },
    ];

    const { getByText } = render(
      <DebtContext.Provider value={{ debts: mockDebts }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    expect(getByText('Total Pendiente: $150.00')).toBeTruthy();
    expect(getByText('Tarjetas: $100.00')).toBeTruthy();
    expect(getByText('Créditos: $50.00')).toBeTruthy();
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
  });

  it('navigates to AddDebt on FAB press', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [] }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('fab-add-debt'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });

  it('navigates to DebtDetail on debt item press', () => {
    const mockDebts = [
      { id: '1', description: 'Debt 1', amount: 100, category: 'Tarjetas', paid: false },
    ];

    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: mockDebts }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('debt-item-1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { debtId: '1' });
  });
});
