import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';

const mockNavigation = {
  navigate: jest.fn(),
};

const renderWithContext = (debts, loading = false) => {
  return render(
    <DebtContext.Provider value={{ debts, loading, deleteDebt: jest.fn() }}>
      <HomeScreen navigation={mockNavigation} />
    </DebtContext.Provider>
  );
};

describe('HomeScreen', () => {
  it('renders loading state', () => {
    const { getByText } = renderWithContext([], true);
    expect(getByText('Cargando...')).toBeTruthy();
  });

  it('renders empty state', () => {
    const { getByText } = renderWithContext([], false);
    expect(getByText('No tienes deudas pendientes. ¡Genial!')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });

  it('renders list of debts', () => {
    const debts = [
      { id: '1', title: 'Debt 1', amount: 50, type: 'Individual', date: '2023-01-01' },
      { id: '2', title: 'Debt 2', amount: 150, type: 'Tarjeta', date: '2023-01-02' },
    ];
    const { getByText, getByTestId } = renderWithContext(debts, false);

    expect(getByText('$200.00')).toBeTruthy();
    expect(getByTestId('debt-title-1').props.children).toBe('Debt 1');
    expect(getByTestId('debt-title-2').props.children).toBe('Debt 2');
  });

  it('navigates to AddEditDebt screen when FAB is pressed', () => {
    const { getByTestId } = renderWithContext([], false);
    fireEvent.press(getByTestId('add-debt-fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });
});
