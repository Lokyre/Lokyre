import React, { useContext } from 'react';
import { Text, View, Button } from 'react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, markPaid } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debts-count">{debts.length}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta', dueDate: '10/10/2023', description: '' })}
      />
      {debts.length > 0 && (
        <>
          <Text testID="first-debt-status">{debts[0].isPaid ? 'Paid' : 'Pending'}</Text>
          <Button testID="delete-btn" title="Delete" onPress={() => deleteDebt(debts[0].id)} />
          <Button testID="mark-paid-btn" title="Mark Paid" onPress={() => markPaid(debts[0].id)} />
        </>
      )}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads initial data from AsyncStorage', async () => {
    const mockDebts = [{ id: '1', title: 'Old Debt', amount: 50, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debts-count').props.children).toBe(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('debts');
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

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
