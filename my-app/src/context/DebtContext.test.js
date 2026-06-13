import React, { useContext } from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Test Component to consume Context
const TestComponent = () => {
  const { debts, loading } = useContext(DebtContext);
  return (
    <>
      <Text testID="loading">{loading ? 'true' : 'false'}</Text>
      <Text testID="debts-count">{debts.length}</Text>
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    expect(getByTestId('loading').props.children).toBe('false');
    expect(getByTestId('debts-count').props.children).toBe(1);
  });
});
