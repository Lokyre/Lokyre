import React, { useContext } from 'react';
import { Text, View, Button } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, toggleDebtStatus } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debts-count">{debts.length}</Text>
      {debts.map(debt => (
        <View key={debt.id}>
          <Text testID={`debt-name-${debt.id}`}>{debt.name}</Text>
          <Text testID={`debt-paid-${debt.id}`}>{debt.isPaid ? 'Paid' : 'Pending'}</Text>
        </View>
      ))}
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({ name: 'Test Debt', amount: 100, type: 'Tarjeta' })}
      />
      <Button
        testID="update-btn"
        title="Update"
        onPress={() => updateDebt(debts[0]?.id, { name: 'Updated Debt' })}
      />
      <Button
        testID="toggle-btn"
        title="Toggle"
        onPress={() => toggleDebtStatus(debts[0]?.id)}
      />
      <Button
        testID="delete-btn"
        title="Delete"
        onPress={() => deleteDebt(debts[0]?.id)}
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
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
    });
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    AsyncStorage.setItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });
  });
});
