import React, { useContext, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import { render, screen, act } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt } = useContext(DebtContext);

  useEffect(() => {
    // Add a debt on mount for testing
    addDebt({
      id: '1',
      title: 'Test Debt',
      amount: 100,
      category: 'Tarjetas',
    });
  }, []);

  return (
    <View>
      <Text testID="debts-length">{debts.length.toString()}</Text>
      <Button testID="delete-btn" onPress={() => deleteDebt('1')} title="Delete" />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('manages debts correctly', async () => {
    let result;
    await act(async () => {
      result = render(
        <DebtProvider>
          <TestComponent />
        </DebtProvider>
      );
    });

    const lengthElem = await screen.findByTestId('debts-length');
    expect(lengthElem.props.children).toBe('1');
  });
});
