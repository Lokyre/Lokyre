import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, useDebts } from '../src/context/DebtContext';

const TestComponent = () => {
  const { debts, addDebt } = useDebts();
  return (
    <>
      <Text testID="debt-count">{debts.length.toString()}</Text>
      <Text testID="add-btn" onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta', dueDate: '2023-12-31' })}>Add</Text>
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Old Debt', amount: 50, type: 'Crédito', dueDate: '2023-10-10', isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Give sufficient time for useEffect's async operation to finish
    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('1');
    });
  });

  it('adds a new debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('0');
    });

    await act(async () => {
      getByTestId('add-btn').props.onPress();
    });

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe('1');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', expect.any(String));
    });
  });
});
