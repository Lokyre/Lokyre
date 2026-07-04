import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, useDebts } from '../context/DebtContext';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = ({ onMount }) => {
  const { debts, addDebt, deleteDebt, togglePaidStatus } = useDebts();

  useEffect(() => {
    if (onMount) onMount({ addDebt, deleteDebt, togglePaidStatus });
  }, []);

  return (
    <View>
      {debts.map(d => (
        <Text key={d.id} testID={`debt-${d.id}`}>{d.title}</Text>
      ))}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const component = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
        await Promise.resolve();
    });

    const textElement = component.getByText('Test Debt');
    expect(textElement).toBeTruthy();
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    let actions;

    const component = render(
      <DebtProvider>
        <TestComponent onMount={(a) => { actions = a; }} />
      </DebtProvider>
    );

    await act(async () => {
      await actions.addDebt({ title: 'New Debt', amount: 200 });
    });

    const textElement = component.getByText('New Debt');
    expect(textElement).toBeTruthy();
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
