import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, useDebts } from '../src/context/DebtContext';
import { Text, View, Button } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, markAsPaid, isLoading } = useDebts();

  return (
    <View>
      <Text testID="loading-status">{isLoading ? 'Loading' : 'Loaded'}</Text>
      <Text testID="debts-count">{debts.length}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({ title: 'New Debt', amount: 100, type: 'Tarjeta', dueDate: '2023-12-31' })}
      />
      <Button
        testID="update-btn"
        title="Update"
        onPress={() => updateDebt(debts[0]?.id, { amount: 200 })}
      />
      <Button
        testID="delete-btn"
        title="Delete"
        onPress={() => deleteDebt(debts[0]?.id)}
      />
      <Button
        testID="paid-btn"
        title="Paid"
        onPress={() => markAsPaid(debts[0]?.id)}
      />
      {debts.map(d => (
        <View key={d.id}>
          <Text testID={`debt-title-${d.id}`}>{d.title}</Text>
          <Text testID={`debt-amount-${d.id}`}>{d.amount}</Text>
          <Text testID={`debt-paid-${d.id}`}>{d.isPaid ? 'Yes' : 'No'}</Text>
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('loads empty debts initially', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    expect(getByTestId('loading-status').props.children).toBe('Loading');

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('loading-status').props.children).toBe('Loaded');
    expect(getByTestId('debts-count').props.children).toBe(0);
  });

  it('can add a debt', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByTestId('debts-count').props.children).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
