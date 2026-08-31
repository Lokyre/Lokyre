import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const renderWithContext = (contextValue) => {
    return render(
      <DebtContext.Provider value={contextValue}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    const { getByText } = renderWithContext({ debts: [], isLoaded: false });
    expect(getByText('Cargando deudas...')).toBeTruthy();
  });

  it('shows empty state when no debts exist', () => {
    const { getByText } = renderWithContext({ debts: [], isLoaded: true });
    expect(getByText('No tienes deudas pendientes. ¡Excelente!')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });

  it('displays a list of debts and calculates total correctly', () => {
    const mockDebts = [
      { id: '1', title: 'Tarjeta Visa', amount: 1000, type: 'Tarjetas' },
      { id: '2', title: 'Prestamo Auto', amount: 5000, type: 'Créditos' },
    ];
    const { getByText, getByTestId } = renderWithContext({ debts: mockDebts, isLoaded: true });

    // Total should be 6000.00
    expect(getByText('$6000.00')).toBeTruthy();

    // Check titles
    expect(getByText('Tarjeta Visa')).toBeTruthy();
    expect(getByText('Prestamo Auto')).toBeTruthy();

    // Check interaction
    fireEvent.press(getByTestId('debt-item-1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { debtId: '1' });
  });

  it('navigates to AddDebt screen when FAB is pressed', () => {
    const { getByTestId } = renderWithContext({ debts: [], isLoaded: true });

    fireEvent.press(getByTestId('fab-add-debt'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });
});