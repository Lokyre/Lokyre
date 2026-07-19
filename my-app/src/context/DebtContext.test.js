import React from 'react';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, useDebtContext } from './DebtContext';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, isLoading, addDebt } = useDebtContext();

  if (isLoading) {
    return <Text testID="loading">Loading...</Text>;
  }

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

    // Wait for async initialization
    await act(async () => {
      await Promise.resolve();
    });

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

    // Wait for async initialization
    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debt-count').props.children).toBe(1);
  });
});
