import React from 'react';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, useDebts } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt } = useDebts();

  return (
    <>
      <Text testID="debt-count">{debts.length.toString()}</Text>
      <Text testID="add-btn" onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta', dueDate: '12/12/2024' })}>Add</Text>
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    expect(getByTestId('debt-count').props.children).toBe('1');
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      getByTestId('add-btn').props.onPress();
    });

    expect(getByTestId('debt-count').props.children).toBe('1');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
