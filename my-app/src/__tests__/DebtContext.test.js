import React, { useContext } from 'react';
import { Text, View, Button } from 'react-native';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, markAsPaid } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debts-count">{debts.length}</Text>
      <Button testID="add-btn" title="Add Debt" onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta', description: '' })} />
      {debts.length > 0 && (
        <>
          <Text testID="first-debt-title">{debts[0].title}</Text>
          <Text testID="first-debt-paid">{debts[0].isPaid.toString()}</Text>
          <Button testID="mark-paid-btn" title="Mark Paid" onPress={() => markAsPaid(debts[0].id)} />
          <Button testID="delete-btn" title="Delete" onPress={() => deleteDebt(debts[0].id)} />
        </>
      )}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
    AsyncStorage.setItem.mockClear();
  });

  it('provides debts state and actions', async () => {
    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Wait for initial load
    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });

    // Add a debt
    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
      expect(getByTestId('first-debt-title').props.children).toBe('Test Debt');
      expect(getByTestId('first-debt-paid').props.children).toBe('false');
    });

    // Mark as paid
    await act(async () => {
      fireEvent.press(getByTestId('mark-paid-btn'));
    });

    await waitFor(() => {
      expect(getByTestId('first-debt-paid').props.children).toBe('true');
    });

    // Delete
    await act(async () => {
      fireEvent.press(getByTestId('delete-btn'));
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });
  });
});
