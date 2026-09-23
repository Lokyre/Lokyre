import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { DebtProvider, useDebts } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native';

const TestComponent = () => {
  const { debts, isLoaded, addDebt } = useDebts();
  return (
    <View>
      <Text testID="loaded">{isLoaded ? 'yes' : 'no'}</Text>
      <Text testID="count">{debts.length}</Text>
      <Text testID="add" onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjetas' })}>Add</Text>
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
      expect(getByTestId('loaded').props.children).toBe('yes');
    }, { timeout: 15000 });

    expect(getByTestId('count').props.children).toBe(0);
  }, 20000); // 20s test timeout
});
