import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider, useDebts } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, isLoaded } = useDebts();

  return (
    <View>
      <Text testID="is-loaded">{isLoaded.toString()}</Text>
      <Text testID="debts-count">{debts.length}</Text>
      {debts.map((d, i) => (
        <Text key={i} testID={`debt-title-${i}`}>{d.title}</Text>
      ))}
      <TouchableOpacity
        testID="add-btn"
        onPress={() => addDebt({ title: 'New Debt', amount: 100, type: 'Tarjeta', description: '' })}
      />
      <TouchableOpacity
        testID="delete-btn"
        onPress={() => {
          if(debts.length > 0) deleteDebt(debts[0].id)
        }}
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 50, type: 'Otro', description: '' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('is-loaded').props.children).toBe('true');
    }, { timeout: 15000 });

    expect(getByTestId('debts-count').props.children).toBe(1);
    expect(getByTestId('debt-title-0').props.children).toBe('Test Debt');
  });

  it('adds a new debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('is-loaded').props.children).toBe('true');
    }, { timeout: 15000 });

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByTestId('debts-count').props.children).toBe(1);
    expect(getByTestId('debt-title-0').props.children).toBe('New Debt');

    // Save is called after add
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts_key',
      expect.stringContaining('New Debt')
    );
  });
});
