import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtContext } from '../context/DebtContext';
import DebtDetailScreen from '../screens/DebtDetailScreen';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');

const mockNavigation = {
  goBack: jest.fn(),
};

const mockDebt = {
  id: '1',
  title: 'Test Deuda',
  amount: 100,
  type: 'Individual',
  dueDate: '01/01/2025',
  description: 'Descripción de prueba',
  isPaid: false,
};

describe('DebtDetailScreen', () => {
  it('marks debt as paid and goes back', async () => {
    const mockMarkAsPaid = jest.fn();
    const mockDeleteDebt = jest.fn();

    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [mockDebt], markAsPaid: mockMarkAsPaid, deleteDebt: mockDeleteDebt }}>
        <DebtDetailScreen route={{ params: { id: '1' } }} navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('btn-mark-paid'));

    await waitFor(() => {
      expect(mockMarkAsPaid).toHaveBeenCalledWith('1');
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  it('prompts delete debt confirmation', async () => {
    const mockMarkAsPaid = jest.fn();
    const mockDeleteDebt = jest.fn();

    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [mockDebt], markAsPaid: mockMarkAsPaid, deleteDebt: mockDeleteDebt }}>
        <DebtDetailScreen route={{ params: { id: '1' } }} navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('btn-delete'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Eliminar Deuda',
        '¿Estás seguro de que deseas eliminar esta deuda?',
        expect.any(Array)
      );
    });
  });
});
