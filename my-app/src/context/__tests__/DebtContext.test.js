import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, togglePaid } = useContext(DebtContext);

  return (
    <View>
      <Text testID="debt-count">{debts.length.toString()}</Text>
      <Text testID="add-debt" onPress={() => addDebt({ title: 'Test', amount: 100, type: 'Individual' })}>
        Add Debt
      </Text>
      {debts.map(d => (
        <View key={d.id}>
          <Text testID={`debt-${d.id}`}>{d.title}</Text>
          <Text testID={`delete-${d.id}`} onPress={() => deleteDebt(d.id)}>Delete</Text>
          <Text testID={`toggle-${d.id}`} onPress={() => togglePaid(d.id)}>Toggle</Text>
          <Text testID={`status-${d.id}`}>{d.isPaid ? 'Paid' : 'Unpaid'}</Text>
        </View>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
  });

  it('loads debts on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Existing', amount: 50, type: 'Individual', isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    expect(getByTestId('debt-count').props.children).toBe('1');
    expect(getByTestId('debt-1').props.children).toBe('Existing');
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(getByTestId('debt-count').props.children).toBe('0');

    await act(async () => {
      fireEvent.press(getByTestId('add-debt'));
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(getByTestId('debt-count').props.children).toBe('1');
  });
});
