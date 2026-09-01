import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtProvider, useDebts } from './DebtContext';
import { Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt } = useDebts();

  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>
      <Button
        title="Add Debt"
        onPress={() => addDebt({ id: '1', title: 'Test Debt', amount: 100, isPaid: false })}
        testID="add-btn"
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage and allows adding a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Wait for the initial load
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    });

    expect(getByTestId('debt-count').props.children).toBe(0);

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
    });

    // Check if saving is triggered
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@debts',
        expect.stringContaining('Test Debt')
      );
    });
  });
});