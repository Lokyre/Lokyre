import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddEditDebtScreen from './AddEditDebtScreen';
import { DebtProvider } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockGoBack = jest.fn();

const renderAddEditScreen = (routeProps = {}) => {
  return render(
    <DebtProvider>
      <AddEditDebtScreen navigation={{ goBack: mockGoBack }} route={routeProps} />
    </DebtProvider>
  );
};

describe('AddEditDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows adding a new debt and calls goBack', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { getByTestId } = renderAddEditScreen();

    const nameInput = getByTestId('debt-name-input');
    const amountInput = getByTestId('debt-amount-input');
    const saveButton = getByTestId('save-button');

    fireEvent.changeText(nameInput, 'New Debt Name');
    fireEvent.changeText(amountInput, '500');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it('populates data when editing', async () => {
    const existingDebt = { id: 'debt_123', name: 'Existing Debt', amount: 300, type: 'Crédito' };
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([existingDebt]));

    const { findByTestId } = renderAddEditScreen({ params: { debtId: 'debt_123' } });

    // Wait for state to populate from context
    const nameInput = await findByTestId('debt-name-input');
    await waitFor(() => {
       expect(nameInput.props.value).toBe('Existing Debt');
    }, { timeout: 10000 });
  });

  it('allows deleting a debt when editing', async () => {
    const existingDebt = { id: 'debt_del', name: 'Delete Me', amount: 100, type: 'Individual' };
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([existingDebt]));

    const { findByTestId } = renderAddEditScreen({ params: { debtId: 'debt_del' } });
    const deleteButton = await findByTestId('delete-button');

    fireEvent.press(deleteButton); // Alert mock will auto-confirm the delete button

    await waitFor(() => {
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});
