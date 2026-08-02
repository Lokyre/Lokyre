import React, { useContext } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, removeDebt } = useContext(DebtContext);
  return (
    <>
      <Text testID="debts-length">{debts.length}</Text>
      <TouchableOpacity
        testID="add-btn"
        onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Tarjeta', description: '' })}
      />
      {debts.map((d) => (
        <TouchableOpacity
          key={d.id}
          testID={`remove-${d.id}`}
          onPress={() => removeDebt(d.id)}
        />
      ))}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts initially', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Old Debt', amount: 50 }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-length').props.children).toBe(1);
    });
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debts-length').props.children).toBe(0);
    });

    fireEvent.press(getByTestId('add-btn'));

    await waitFor(() => {
      expect(getByTestId('debts-length').props.children).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
