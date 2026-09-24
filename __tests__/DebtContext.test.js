import React from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react-native';
import { DebtProvider, useDebts, DEBT_TYPES } from '../src/context/DebtContext';
import { Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente de prueba para consumir el contexto
const TestComponent = () => {
  const { debts, addDebt, updateDebt, deleteDebt, isLoaded } = useDebts();

  return (
    <View>
      <Text testID="is-loaded">{isLoaded ? 'Loaded' : 'Not Loaded'}</Text>
      <Text testID="debts-count">{debts.length}</Text>

      {debts.map(debt => (
        <View key={debt.id}>
          <Text testID={`debt-title-${debt.id}`}>{debt.title}</Text>
          <Text testID={`debt-amount-${debt.id}`}>{debt.amount}</Text>
          <Button
            title="Update"
            onPress={() => updateDebt(debt.id, { amount: 500 })}
            testID={`update-btn-${debt.id}`}
          />
          <Button
            title="Delete"
            onPress={() => deleteDebt(debt.id)}
            testID={`delete-btn-${debt.id}`}
          />
        </View>
      ))}

      <Button
        title="Add"
        onPress={() => addDebt({
          title: 'Test Debt',
          amount: 100,
          type: DEBT_TYPES.TARJETAS,
          description: 'Test Description'
        })}
        testID="add-btn"
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads empty debts initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Esperar a que isLoaded sea true
    await waitFor(() => {
      expect(getByTestId('is-loaded').props.children).toBe('Loaded');
    }, { timeout: 10000 });

    expect(getByTestId('debts-count').props.children).toBe(0);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts_data');
  });

  it('can add a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('is-loaded').props.children).toBe('Loaded');
    }, { timeout: 10000 });

    act(() => {
      fireEvent.press(getByTestId('add-btn'));
    });

    await waitFor(() => {
      expect(getByTestId('debts-count').props.children).toBe(1);
    }, { timeout: 10000 });

    // Se debe haber llamado a setItem porque debts cambió
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('loads existing debts from storage', async () => {
    const mockDebts = [
      {
        id: '1',
        title: 'Mock Debt',
        amount: 200,
        type: DEBT_TYPES.CREDITOS,
        date: new Date().toISOString()
      }
    ];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('is-loaded').props.children).toBe('Loaded');
    }, { timeout: 10000 });

    expect(getByTestId('debts-count').props.children).toBe(1);
    expect(getByTestId('debt-title-1').props.children).toBe('Mock Debt');
    expect(getByTestId('debt-amount-1').props.children).toBe(200);
  });
});