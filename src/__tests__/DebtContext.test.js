import React, { useContext, useEffect } from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

const TestComponent = ({ onAction }) => {
  const { debts, addDebt, updateDebt, deleteDebt, togglePaidStatus } = useContext(DebtContext);
  useEffect(() => {
    if (onAction) onAction({ addDebt, updateDebt, deleteDebt, togglePaidStatus });
  }, [addDebt, updateDebt, deleteDebt, togglePaidStatus, onAction]);

  return <Text testID="debts-length">{debts.length.toString()}</Text>;
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', name: 'Test Debt', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-length').props.children).toBe('1');
    });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('debts');
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    let contextActions;
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent onAction={(actions) => (contextActions = actions)} />
      </DebtProvider>
    );

    await waitFor(() => expect(contextActions).toBeDefined());

    await act(async () => {
      contextActions.addDebt({ name: 'New Debt', amount: 50 });
    });

    expect(getByTestId('debts-length').props.children).toBe('1');
  });
});
