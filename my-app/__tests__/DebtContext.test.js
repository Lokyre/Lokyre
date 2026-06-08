import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtContext, DebtProvider } from '../src/context/DebtContext';
import { Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, togglePaid } = React.useContext(DebtContext);
  return (
    <View>
      <Text testID="debts-length">{debts.length}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({ title: 'Test', amount: 100, type: 'Tarjeta', isPaid: false })}
      />
      <Button
        testID="update-btn"
        title="Update"
        onPress={() => debts[0] && updateDebt(debts[0].id, { title: 'Updated' })}
      />
      <Button
        testID="toggle-btn"
        title="Toggle"
        onPress={() => debts[0] && togglePaid(debts[0].id)}
      />
      <Button
        testID="delete-btn"
        title="Delete"
        onPress={() => debts[0] && deleteDebt(debts[0].id)}
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty debts and add a debt', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve(); // Wait for initial AsyncStorage.getItem
    });

    expect(getByTestId('debts-length').props.children).toBe(0);

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
      await Promise.resolve();
    });

    expect(getByTestId('debts-length').props.children).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('should load debts from AsyncStorage on mount', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Old Debt', amount: 50, type: 'Individual', isPaid: false }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve(); // Wait for loadDebts
    });

    expect(getByTestId('debts-length').props.children).toBe(1);
  });
});