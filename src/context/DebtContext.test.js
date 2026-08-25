import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { DebtProvider, useDebts, DebtContext } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt } = useDebts();
  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>
      <Text testID="add-debt" onPress={() => addDebt({ title: 'New Debt', amount: 100, type: 'tarjeta' })}>Add</Text>
      {debts.map(d => (
        <Text key={d.id} testID={`delete-${d.id}`} onPress={() => deleteDebt(d.id)}>Delete</Text>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test', amount: 50, type: 'tarjeta', status: 'pendiente' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {}, { timeout: 10000 });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts_v1');
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => expect(getByTestId('debt-count').props.children).toBe(0));

    await act(async () => {
      getByTestId('add-debt').props.onPress();
    });

    await waitFor(() => {}, { timeout: 10000 });
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
