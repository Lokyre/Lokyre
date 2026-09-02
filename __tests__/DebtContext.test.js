import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { DebtProvider, useDebts } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, removeDebt, getTotalDebtAmount } = useDebts();

  return (
    <>
      <Text testID="debts-count">{debts.length}</Text>
      <Text testID="total-amount">{getTotalDebtAmount()}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({ name: 'Test Debt', amount: 100, type: 'Tarjeta' })}
      />
      {debts.length > 0 && (
        <Button
          testID="remove-btn"
          title="Remove"
          onPress={() => removeDebt(debts[0].id)}
        />
      )}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads empty debts initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
      expect(getByTestId('total-amount').props.children).toBe(0);
    });
  });

  it('adds and removes a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, findByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
      expect(getByTestId('total-amount').props.children).toBe(100);
    });

    const removeBtn = await findByTestId('remove-btn');
    await act(async () => {
      fireEvent.press(removeBtn);
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
      expect(getByTestId('total-amount').props.children).toBe(0);
    });
  });
});
