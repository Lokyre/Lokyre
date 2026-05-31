import React, { useContext } from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from './DebtContext';

const TestComponent = () => {
  const { debts, addDebt, toggleDebtStatus, deleteDebt } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debts-count">{debts.length}</Text>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('loads empty debts initially if storage is empty', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 100 }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    });
  });
});
