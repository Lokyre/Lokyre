import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, useDebts } from '../context/DebtContext';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, togglePaidStatus } = useDebts();

  return (
    <>
      <Text testID="debt-count">{debts.length}</Text>
      {debts.map(d => (
        <Text key={d.id} testID={`debt-${d.id}`}>{d.title}-{d.isPaid ? 'paid' : 'unpaid'}</Text>
      ))}
      <Text testID="add-btn" onPress={() => addDebt({ id: '1', title: 'Test', amount: 100, isPaid: false })}>Add</Text>
      <Text testID="update-btn" onPress={() => updateDebt('1', { title: 'Updated' })}>Update</Text>
      <Text testID="delete-btn" onPress={() => deleteDebt('1')}>Delete</Text>
      <Text testID="toggle-btn" onPress={() => togglePaidStatus('1')}>Toggle</Text>
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts on mount', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '99', title: 'Saved', amount: 50, isPaid: false }]));

    const rendered = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    const { getByTestId, queryByText } = rendered;
    expect(getByTestId('debt-count').props.children).toBe(1);
    expect(queryByText('Saved-unpaid')).toBeTruthy();
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const rendered = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    const { getByTestId, queryByText } = rendered;

    await act(async () => {
      getByTestId('add-btn').props.onPress();
    });

    expect(getByTestId('debt-count').props.children).toBe(1);
    expect(queryByText('Test-unpaid')).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', JSON.stringify([{ id: '1', title: 'Test', amount: 100, isPaid: false }]));
  });
});
