import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { DebtProvider, useDebtContext } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente de prueba para consumir el contexto
const TestComponent = () => {
  const { debts, loading, addDebt } = useDebtContext();

  if (loading) return <Text>Loading...</Text>;

  return (
    <View>
      <Text testID="debts-length">{debts.length.toString()}</Text>
      {debts.map(d => (
        <Text key={d.id} testID={`debt-title-${d.id}`}>{d.title}</Text>
      ))}
      <Text testID="add-btn" onPress={() => addDebt({ title: 'Nueva Deuda', amount: 100, type: 'Tarjeta' })}>Add</Text>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería inicializar con deudas vacías si no hay guardadas', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByText, getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Esperar a que se resuelva AsyncStorage.getItem
    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debts-length').props.children).toBe('0');
  });

  it('debería añadir una nueva deuda', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Esperar a que termine la carga inicial
    await act(async () => {
      await Promise.resolve();
    });

    const addBtn = getByTestId('add-btn');

    await act(async () => {
      addBtn.props.onPress();
    });

    expect(getByTestId('debts-length').props.children).toBe('1');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
