import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { DebtProvider, useDebtContext } from '../src/context/DebtContext';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { isLoaded, debts } = useDebtContext();
  if (!isLoaded) return <Text>Loading</Text>;
  return <Text testID="debt-count">{debts.length}</Text>;
};

describe('DebtContext', () => {
  it('loads empty array when no storage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(0);
    }, { timeout: 15000 });
  });
});
