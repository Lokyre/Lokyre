import React, { useContext, useEffect } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import { Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt } = useContext(DebtContext);

  return (
    <View>
      {debts.map(d => <Text key={d.id} testID={`debt-${d.id}`}>{d.titulo}</Text>)}
      <TouchableOpacity testID="add-btn" onPress={() => addDebt({ titulo: 'New Debt', monto: 100, categoria: 'Personas', fecha: '2023-01-01' })}>
        <Text>Add Debt</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="delete-btn" onPress={() => debts.length > 0 && deleteDebt(debts[0].id)}>
        <Text>Delete Debt</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    const mockDebts = [{ id: '1', titulo: 'Loaded Debt' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-1')).toBeTruthy();
    });
  });

  it('adds a new debt and saves to AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByText('New Debt')).toBeTruthy();
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
