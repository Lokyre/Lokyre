import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtProvider, useDebtContext } from '../context/DebtContext';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A simple test component to consume context
const TestComponent = () => {
  const { debts, addDebt, deleteDebt, updateDebt } = useDebtContext();

  return (
    <View>
      <Text testID="debts-count">{debts.length}</Text>
      <Button
        title="Add Debt"
        testID="add-btn"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, description: 'Testing', type: 'Tarjeta' })}
      />
      {debts.map(debt => (
        <View key={debt.id} testID={`debt-item-${debt.id}`}>
          <Text>{debt.title}</Text>
          <Button title="Delete" testID={`delete-btn-${debt.id}`} onPress={() => deleteDebt(debt.id)} />
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a debt correctly', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Initial count should be 0 after load
    await waitFor(() => {});

    // Add a debt
    fireEvent.press(getByTestId('add-btn'));

    // Count should be 1
    await waitFor(() => {});

    // Check if the item exists
    expect(getByTestId('debt-item-test-uuid-1234')).toBeTruthy();
  });

  it('deletes a debt correctly', async () => {
    const initialDebts = [
      { id: 'test-uuid-1234', title: 'Test Debt', amount: 100, description: 'Testing', type: 'Tarjeta' }
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(initialDebts));

    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Wait for load and check count is 1
    await waitFor(() => {});

    // Delete the debt
    fireEvent.press(getByTestId('delete-btn-test-uuid-1234'));

    // Count should be 0
    await waitFor(() => {});

    // Check if the item is removed
    expect(queryByTestId('debt-item-test-uuid-1234')).toBeNull();
  });
});
