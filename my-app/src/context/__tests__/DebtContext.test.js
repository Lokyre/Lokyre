import React from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtProvider, useDebts } from '../DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, Button } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, isReady } = useDebts();
  if (!isReady) return <Text testID="loading">Loading</Text>;
  return (
    <View>
      <Text testID="debts-length">{debts.length}</Text>
      <Button
        title="Add Debt"
        testID="add-btn"
        onPress={() => addDebt({ id: '1', title: 'Test', amount: '100', type: 'Tarjeta', isPaid: false })}
      />
      <Button
        title="Delete Debt"
        testID="delete-btn"
        onPress={() => deleteDebt('1')}
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage and sets isReady to true', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Test Debt' }]));

    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(queryByTestId('loading')).toBeNull();
    });

    expect(getByTestId('debts-length').props.children).toBe(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('adds a debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-length').props.children).toBe(0);
    });

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.press(getByTestId('add-btn'));

    expect(getByTestId('debts-length').props.children).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts',
      JSON.stringify([{ id: '1', title: 'Test', amount: '100', type: 'Tarjeta', isPaid: false }])
    );
  });

  it('deletes a debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Test', amount: '100', type: 'Tarjeta', isPaid: false }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-length').props.children).toBe(1);
    });

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.press(getByTestId('delete-btn'));

    expect(getByTestId('debts-length').props.children).toBe(0);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', JSON.stringify([]));
  });
});
