import React, { useContext } from 'react';
import { Text, View, Button } from 'react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, loading } = useContext(DebtContext);

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>
      {debts.map((d) => (
        <Text key={d.id} testID={`debt-title-${d.id}`}>{d.title}</Text>
      ))}
      <Button
        title="Add Debt"
        testID="add-btn"
        onPress={() => addDebt({ title: 'New Debt', amount: 100, type: 'Tarjeta', dueDate: '2025-01-01', description: '' })}
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 50, type: 'Persona', dueDate: '2025-01-01', description: '', isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Wait for the context to finish loading
    await act(async () => {
      await Promise.resolve();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts_data');
    expect(queryByText('Loading...')).toBeNull();
    expect(getByTestId('debt-count').props.children).toBe(1);
    expect(getByTestId('debt-title-1').props.children).toBe('Test Debt');
  });

  it('adds a debt and saves it to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debt-count').props.children).toBe(0);

    const addBtn = getByTestId('add-btn');
    await act(async () => {
      fireEvent.press(addBtn);
    });

    expect(getByTestId('debt-count').props.children).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
