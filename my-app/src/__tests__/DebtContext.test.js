import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider } from '../../src/context/DebtContext';
import { View, Text } from 'react-native';
import { useDebts } from '../../src/context/DebtContext';

const TestComponent = () => {
  const { debts, addDebt } = useDebts();
  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>
    </View>
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

    await act(async () => { await Promise.resolve(); });

    expect(getByTestId('debt-count').props.children).toBe(0);
  });

  it('loads debts from AsyncStorage', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(getByTestId('debt-count').props.children).toBe(1);
  });
});
