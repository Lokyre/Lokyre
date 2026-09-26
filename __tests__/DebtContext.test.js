import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, useDebts } from '../src/context/DebtContext';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, totalDebt, isLoaded } = useDebts();

  if (!isLoaded) return <Text>Loading...</Text>;

  return (
    <>
      <Text testID="debts-count">{debts.length}</Text>
      <Text testID="total-debt">{totalDebt}</Text>
      <Text testID="add-debt" onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjetas', dueDate: '2024-01-01' })}>Add</Text>
      {debts.length > 0 && (
        <>
          <Text testID="update-debt" onPress={() => updateDebt({ ...debts[0], amount: 200 })}>Update</Text>
          <Text testID="delete-debt" onPress={() => deleteDebt(debts[0].id)}>Delete</Text>
        </>
      )}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts on mount', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Test', amount: 50, type: 'Tarjetas' }]));

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    expect(queryByText('Loading...')).toBeTruthy();

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    }, { timeout: 15000 });
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });

    await act(async () => {
      getByTestId('add-debt').props.onPress();
    });

    expect(getByTestId('debts-count').props.children).toBe(1);
    expect(getByTestId('total-debt').props.children).toBe(100);
  });
});
