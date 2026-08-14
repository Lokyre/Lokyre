import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper component to test context
const TestComponent = () => {
  const { debts, addDebt, deleteDebt, loading } = React.useContext(DebtContext);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>
      <Text testID="add-debt" onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Individual', date: '2023-01-01' })}>Add</Text>
      <Text testID="delete-debt" onPress={() => debts.length > 0 && deleteDebt(debts[0].id)}>Delete</Text>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('loads empty debts initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(queryByText('Loading...')).toBeNull();
    });

    expect(getByTestId('debt-count').props.children).toBe(0);
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(queryByText('Loading...')).toBeNull();
    });

    await act(async () => {
      getByTestId('add-debt').props.onPress();
    });

    expect(getByTestId('debt-count').props.children).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
