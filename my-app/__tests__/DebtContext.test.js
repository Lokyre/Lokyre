import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { DebtProvider, useDebtContext } from '../src/context/DebtContext';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, loading } = useDebtContext();
  return (
    <View>
      <Text testID="loading-state">{loading ? 'Loading' : 'Ready'}</Text>
      <Text testID="debts-count">{debts.length.toString()}</Text>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Test Debt' }]));

    const { getByTestId, rerender } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    await waitFor(() => {
      expect(getByTestId('loading-state').props.children).toBe('Ready');
      expect(getByTestId('debts-count').props.children).toBe('1');
    });
  });

  it('handles empty or null AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe('0');
    });
  });
});
