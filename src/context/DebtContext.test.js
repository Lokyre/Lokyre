import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtProvider, useDebtContext } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, Button } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, getCategorizedDebts, getTotalDebt, isLoaded } = useDebtContext();

  if (!isLoaded) return <Text>Loading</Text>;

  return (
    <View>
      <Text testID="total">{getTotalDebt()}</Text>
      <Button testID="add" title="Add" onPress={() => addDebt({ title: 'Test', amount: 100, category: 'Tarjetas' })} />
      <Text testID="count">{debts.length}</Text>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from storage on mount', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Test Debt', amount: 50, category: 'Personas' }]));

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(queryByText('Loading')).toBeNull();
    }, { timeout: 15000 });

    expect(getByTestId('total').props.children).toBe(50);
    expect(getByTestId('count').props.children).toBe(1);
  }, 20000);

  it('adds a debt and saves to storage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(queryByText('Loading')).toBeNull();
    }, { timeout: 15000 });

    fireEvent.press(getByTestId('add'));

    await waitFor(() => {
      expect(getByTestId('count').props.children).toBe(1);
      expect(getByTestId('total').props.children).toBe(100);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    }, { timeout: 15000 });
  }, 20000);
});
