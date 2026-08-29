import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, useDebts } from './DebtContext';

const TestComponent = ({ action, id, payload }) => {
  const { debts, addDebt, updateDebt, deleteDebt } = useDebts();

  React.useEffect(() => {
    if (action === 'add') addDebt(payload);
    if (action === 'update') updateDebt(id, payload);
    if (action === 'delete') deleteDebt(id);
  }, []);

  return (
    <View>
      <Text testID="debts">{JSON.stringify(debts)}</Text>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', name: 'Test', amount: 100, type: 'Individual' }];
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent action="none" />
      </DebtProvider>
    );

    await waitFor(() => {
      const textContent = getByTestId('debts').props.children;
      expect(textContent).toContain('Test');
    }, { timeout: 10000 });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('adds a debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const newDebt = { name: 'New Debt', amount: 200, type: 'Crédito' };

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent action="add" payload={newDebt} />
      </DebtProvider>
    );

    await waitFor(() => {
      const textContent = getByTestId('debts').props.children;
      expect(textContent).toContain('New Debt');
    }, { timeout: 10000 });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    const setItemArgs = AsyncStorage.setItem.mock.calls[0];
    expect(setItemArgs[0]).toBe('@debts');
    expect(setItemArgs[1]).toContain('New Debt');
    expect(setItemArgs[1]).toContain('200');
  });
});
