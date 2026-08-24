import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, useDebts } from '../context/DebtContext';

const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, loading } = useDebts();

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>
      <Button
        testID="add-btn"
        title="Add"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'persona' })}
      />
      {debts.map(debt => (
        <View key={debt.id} testID={`debt-item-${debt.id}`}>
          <Text testID={`debt-title-${debt.id}`}>{debt.title}</Text>
          <Text testID={`debt-status-${debt.id}`}>{debt.status}</Text>
          <Button testID={`update-btn-${debt.id}`} title="Update" onPress={() => updateDebt(debt.id, { status: 'paid' })} />
          <Button testID={`delete-btn-${debt.id}`} title="Delete" onPress={() => deleteDebt(debt.id)} />
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads empty debts initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(0);
    }, { timeout: 10000 });
  });

  it('loads existing debts', async () => {
    const mockDebts = [{ id: '1', title: 'Old Debt', amount: 50, type: 'credito', status: 'pending', createdAt: '2023-01-01T00:00:00.000Z' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
      expect(getByTestId('debt-title-1').props.children).toBe('Old Debt');
    });
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(0);
    }, { timeout: 10000 });

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
