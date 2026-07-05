import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { DebtProvider, useDebts } from '../DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A test component that consumes the context
const TestComponent = () => {
  const { debts, addDebt, deleteDebt, loading, togglePaid } = useDebts();

  return (
    <View>
      <Text testID="loading">{loading ? 'Loading' : 'Loaded'}</Text>
      <Text testID="debt-count">{debts.length.toString()}</Text>
      <Text testID="add-btn" onPress={() => addDebt({
        title: 'Test Debt',
        amount: '100',
        type: 'Tarjeta',
        dueDate: '12/12/2024',
        description: 'Test'
      })}>
        Add
      </Text>
      {debts.map(d => (
        <View key={d.id}>
          <Text testID={`debt-title-${d.id}`}>{d.title}</Text>
          <Text testID={`debt-paid-${d.id}`}>{d.isPaid ? 'Paid' : 'Unpaid'}</Text>
          <Text testID={`toggle-btn-${d.id}`} onPress={() => togglePaid(d.id)}>Toggle</Text>
          <Text testID={`delete-btn-${d.id}`} onPress={() => deleteDebt(d.id)}>Delete</Text>
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads empty debts initially if storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(getByTestId('loading').props.children).toBe('Loaded');
    expect(getByTestId('debt-count').props.children).toBe("0");
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(getByTestId('loading').props.children).toBe('Loaded');

    await act(async () => {
      getByTestId('add-btn').props.onPress();
    });

    await act(async () => { await Promise.resolve(); });

    expect(getByTestId('debt-count').props.children).toBe("1");
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
