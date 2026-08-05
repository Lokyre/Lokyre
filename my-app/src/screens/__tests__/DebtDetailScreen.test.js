import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtDetailScreen from '../DebtDetailScreen';
import { DebtContext } from '../../context/DebtContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(),
}));

describe('DebtDetailScreen', () => {
  const mockTogglePaid = jest.fn();
  const mockDeleteDebt = jest.fn();
  const mockGoBack = jest.fn();

  beforeEach(() => {
    useNavigation.mockReturnValue({ goBack: mockGoBack });
    useRoute.mockReturnValue({ params: { debtId: '1' } });
    jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      // Simulate pressing the "Eliminar" button which is at index 1
      if (buttons && buttons[1] && buttons[1].onPress) {
        buttons[1].onPress();
      }
    });
    mockTogglePaid.mockClear();
    mockDeleteDebt.mockClear();
    mockGoBack.mockClear();
    Alert.alert.mockClear();
  });

  const debts = [
    {
      id: '1',
      title: 'Debt 1',
      amount: 100,
      type: 'Individual',
      isPaid: false,
      createdAt: new Date().toISOString(),
    }
  ];

  it('shows not found if debt does not exist', () => {
    useRoute.mockReturnValue({ params: { debtId: '99' } });
    const { getByText } = render(
      <DebtContext.Provider value={{ debts, togglePaid: mockTogglePaid, deleteDebt: mockDeleteDebt }}>
        <DebtDetailScreen />
      </DebtContext.Provider>
    );

    expect(getByText('No se encontró la deuda.')).toBeTruthy();
  });

  it('renders debt details correctly', () => {
    const { getByText } = render(
      <DebtContext.Provider value={{ debts, togglePaid: mockTogglePaid, deleteDebt: mockDeleteDebt }}>
        <DebtDetailScreen />
      </DebtContext.Provider>
    );

    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('$100.00')).toBeTruthy();
    expect(getByText('Pendiente')).toBeTruthy();
  });

  it('toggles paid status', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts, togglePaid: mockTogglePaid, deleteDebt: mockDeleteDebt }}>
        <DebtDetailScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('btn-toggle-paid'));
    expect(mockTogglePaid).toHaveBeenCalledWith('1');
  });

  it('deletes a debt', async () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts, togglePaid: mockTogglePaid, deleteDebt: mockDeleteDebt }}>
        <DebtDetailScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('btn-delete'));

    // Alert mock automatically calls delete
    expect(Alert.alert).toHaveBeenCalled();
    expect(mockDeleteDebt).toHaveBeenCalledWith('1');

    // Wait for the async delete to theoretically resolve
    await Promise.resolve();
    expect(mockGoBack).toHaveBeenCalled();
  });
});
