import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DebtProvider, useDebts } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, isLoaded } = useDebts();

  if (!isLoaded) return <Text>Cargando...</Text>;

  return (
    <>
      <Text testID="debtCount">{debts.length}</Text>
      <Text onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Créditos' })} testID="addBtn">Add</Text>
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('loads empty debts initially', async () => {
    render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      // wait for async storage load
    });

    expect(await screen.findByTestId('debtCount')).toHaveTextContent('0');
  });
});
