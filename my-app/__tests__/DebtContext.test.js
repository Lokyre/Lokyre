import React from 'react';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, useDebts } from '../src/context/DebtContext';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper component to access context in tests
const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, togglePaid } = useDebts();

  return (
    <View>
      <Text testID="debts-count">{debts.length}</Text>
      <TouchableOpacity
        testID="add-btn"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Individual', dueDate: '2025-01-01', description: '' })}
      />
      <TouchableOpacity
        testID="update-btn"
        onPress={() => updateDebt(debts[0]?.id, { title: 'Updated Debt' })}
      />
      <TouchableOpacity
        testID="delete-btn"
        onPress={() => deleteDebt(debts[0]?.id)}
      />
      <TouchableOpacity
        testID="toggle-btn"
        onPress={() => togglePaid(debts[0]?.id)}
      />
      {debts.map(d => (
        <View key={d.id} testID={`debt-${d.id}`}>
          <Text testID={`debt-title-${d.id}`}>{d.title}</Text>
          <Text testID={`debt-paid-${d.id}`}>{d.isPaid ? 'true' : 'false'}</Text>
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

  it('initializes with empty debts if nothing in storage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debts-count').props.children).toBe(0);
  });
});
