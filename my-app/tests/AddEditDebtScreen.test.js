import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddEditDebtScreen from '../src/screens/AddEditDebtScreen';
import * as DebtContext from '../src/context/DebtContext';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('AddEditDebtScreen', () => {
  const mockGoBack = jest.fn();
  const mockAddDebt = jest.fn();
  const mockUpdateDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(DebtContext, 'useDebts').mockReturnValue({
      debts: [
        { id: '1', title: 'Existing Debt', amount: 200, type: 'Crédito', dueDate: '2024-01-01', description: 'Test desc' }
      ],
      addDebt: mockAddDebt,
      updateDebt: mockUpdateDebt,
    });
  });

  it('allows user to add a new debt', async () => {
    const { getByTestId } = render(
      <AddEditDebtScreen route={{ params: {} }} navigation={{ goBack: mockGoBack }} />
    );

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '150');
    fireEvent.changeText(getByTestId('input-dueDate'), '2023-11-15');

    fireEvent.press(getByTestId('btn-save'));

    await waitFor(() => {
      expect(mockAddDebt).toHaveBeenCalledWith({
        title: 'New Debt',
        amount: 150,
        type: 'Tarjeta', // default
        dueDate: '2023-11-15',
        description: '',
      });
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it('shows error alert if required fields are missing', async () => {
    const { getByTestId } = render(
      <AddEditDebtScreen route={{ params: {} }} navigation={{ goBack: mockGoBack }} />
    );

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    // Leaving amount empty

    fireEvent.press(getByTestId('btn-save'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
      expect(mockAddDebt).not.toHaveBeenCalled();
    });
  });

  it('populates fields when editing an existing debt', () => {
    const { getByTestId } = render(
      <AddEditDebtScreen route={{ params: { debtId: '1' } }} navigation={{ goBack: mockGoBack }} />
    );

    expect(getByTestId('input-title').props.value).toBe('Existing Debt');
    expect(getByTestId('input-amount').props.value).toBe('200');
  });
});
