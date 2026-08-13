import React, { useContext } from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import { Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A simple component to test the context
const TestComponent = () => {
  const { debts, loading, addDebt, deleteDebt } = useContext(DebtContext);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text testID="debts-count">{debts.length}</Text>
      <Button
        title="Add Debt"
        testID="btn-add"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta' })}
      />
      {debts.length > 0 && (
        <Button
          title="Delete Debt"
          testID="btn-delete"
          onPress={() => deleteDebt(debts[0].id)}
        />
      )}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('loads with 0 debts initially', async () => {
    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });
  });

  it('can add and then delete a debt', async () => {
    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });

    // Add debt
    act(() => {
      fireEvent.press(getByTestId('btn-add'));
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    });

    // Delete debt
    act(() => {
      fireEvent.press(getByTestId('btn-delete'));
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(0);
    });
  });
});
