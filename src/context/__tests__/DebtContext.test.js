import React, { useContext } from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../DebtContext';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, removeDebt, updateDebt, markAsPaid } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({ name: 'Test Debt', amount: 100, category: 'Tarjetas' })}
      />
      <Button
        testID="remove-btn"
        title="Remove"
        onPress={() => removeDebt(debts[0]?.id)}
      />
      <Button
        testID="update-btn"
        title="Update"
        onPress={() => updateDebt({ ...debts[0], name: 'Updated Debt' })}
      />
      <Button
        testID="pay-btn"
        title="Pay"
        onPress={() => markAsPaid(debts[0]?.id)}
      />
      <Text testID="debt-name">{debts[0]?.name || 'none'}</Text>
      <Text testID="debt-status">{debts[0]?.isPaid ? 'paid' : 'unpaid'}</Text>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
  });

  it('adds a debt', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => expect(getByTestId('debt-count').props.children).toBe(0), { timeout: 10000 });

    act(() => {
      fireEvent.press(getByTestId('add-btn'));
    });

    await waitFor(() => expect(getByTestId('debt-count').props.children).toBe(1));
    expect(getByTestId('debt-name').props.children).toBe('Test Debt');
  });
});
