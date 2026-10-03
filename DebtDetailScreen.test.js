import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtDetailScreen from './DebtDetailScreen';
import { DebtContext } from './DebtContext';
import { NavigationContainer } from '@react-navigation/native';

describe('DebtDetailScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  const mockDeleteDebt = jest.fn();

  const mockDebts = [
    { id: '1', name: 'Test Debt', amount: 150.50, type: 'Tarjetas', description: 'desc', createdAt: '2023-10-01T00:00:00.000Z' }
  ];

  const renderWithContext = (debtId) => {
    return render(
      <DebtContext.Provider value={{ debts: mockDebts, deleteDebt: mockDeleteDebt }}>
        <NavigationContainer>
          <DebtDetailScreen route={{ params: { debtId } }} navigation={mockNavigation} />
        </NavigationContainer>
      </DebtContext.Provider>
    );
  };

  it('shows error when debt not found', () => {
    const { getByText } = renderWithContext('invalid-id');
    expect(getByText('Deuda no encontrada.')).toBeTruthy();
  });

  it('renders debt details correctly', () => {
    const { getByText } = renderWithContext('1');
    expect(getByText('Test Debt')).toBeTruthy();
    expect(getByText('$150.50')).toBeTruthy();
    expect(getByText('Tarjetas')).toBeTruthy();
    expect(getByText('desc')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen on edit action', () => {
    const { getByTestId } = renderWithContext('1');
    fireEvent.press(getByTestId('edit-debt-action'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt', { debtId: '1' });
  });

  it('calls deleteDebt on delete action', () => {
    globalThis.alert = jest.fn(); // Mocking alert for the simplified delete path
    const { getByTestId } = renderWithContext('1');
    fireEvent.press(getByTestId('delete-debt-action'));
    expect(mockDeleteDebt).toHaveBeenCalledWith('1');
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
