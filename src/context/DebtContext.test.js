import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtProvider, useDebts } from './DebtContext';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A test component to consume and interact with our context
const TestComponent = () => {
  const { debts, isLoaded, addDebt, updateDebt, deleteDebt, addPayment } = useDebts();

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>

      {debts.map((debt) => (
        <View key={debt.id} testID={`debt-${debt.id}`}>
          <Text>{debt.title}</Text>
          <Text>{debt.type}</Text>
          <Text>{debt.amount}</Text>

          <TouchableOpacity
            testID={`add-payment-${debt.id}`}
            onPress={() => addPayment(debt.id, { amount: 50 })}
          >
            <Text>Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID={`update-debt-${debt.id}`}
            onPress={() => updateDebt(debt.id, { title: 'Updated Title' })}
          >
            <Text>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID={`delete-debt-${debt.id}`}
            onPress={() => deleteDebt(debt.id)}
          >
            <Text>Delete</Text>
          </TouchableOpacity>

          <Text testID={`payment-count-${debt.id}`}>{debt.payments?.length || 0}</Text>
        </View>
      ))}

      <TouchableOpacity
        testID="add-debt"
        onPress={() => addDebt({ title: 'New Debt', amount: 100, type: 'Crédito' })}
      >
        <Text>Add Debt</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test', amount: 100 }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
    }, { timeout: 10000 });
  }, 15000);

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null); // start empty

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(0);
    }, { timeout: 10000 });

    fireEvent.press(getByTestId('add-debt'));

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    }, { timeout: 10000 });
  });

  it('adds a payment to an existing debt', async () => {
    const mockDebts = [{ id: 'test-id-1', title: 'Test Debt', amount: 100, payments: [] }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
    }, { timeout: 10000 });

    expect(getByTestId('payment-count-test-id-1').props.children).toBe(0);

    fireEvent.press(getByTestId('add-payment-test-id-1'));

    await waitFor(() => {
      expect(getByTestId('payment-count-test-id-1').props.children).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    }, { timeout: 10000 });
  });

  it('updates an existing debt', async () => {
    const mockDebts = [{ id: 'test-id-1', title: 'Test Debt', amount: 100 }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByText('Test Debt')).toBeTruthy();
    }, { timeout: 10000 });

    fireEvent.press(getByTestId('update-debt-test-id-1'));

    await waitFor(() => {
      expect(getByText('Updated Title')).toBeTruthy();
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    }, { timeout: 10000 });
  });

  it('deletes a debt', async () => {
    const mockDebts = [{ id: 'test-id-1', title: 'Test Debt', amount: 100 }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
    }, { timeout: 10000 });

    fireEvent.press(getByTestId('delete-debt-test-id-1'));

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(0);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    }, { timeout: 10000 });
  });
});
