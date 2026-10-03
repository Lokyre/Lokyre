import React, { useContext } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtContext, DebtProvider } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, TouchableOpacity, View } from 'react-native';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt } = useContext(DebtContext);
  return (
    <View>
      <Text testID="debt-count">{debts.length}</Text>
      <TouchableOpacity
        testID="add-btn"
        onPress={() => addDebt({ name: 'Test', amount: 100, type: 'Tarjetas', description: 'desc' })}
      >
        <Text>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="delete-btn"
        onPress={() => deleteDebt(debts[0]?.id)}
      >
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
  });

  it('loads debts from AsyncStorage and can add a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', name: 'Existing', amount: 50, type: 'Personas' }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // wait for load
    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
    });

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(2);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
