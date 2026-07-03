import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider } from './DebtContext';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDebts } from './DebtContext';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, togglePaid } = useDebts();
  return (
    <View>
      {debts.map(d => (
        <View key={d.id}>
          <Text>{d.title}</Text>
          <Text>{d.isPaid ? 'Pagado' : 'Pendiente'}</Text>
          <Button title="Toggle" onPress={() => togglePaid(d.id)} testID={`toggle-${d.id}`} />
          <Button title="Delete" onPress={() => deleteDebt(d.id)} testID={`delete-${d.id}`} />
        </View>
      ))}
      <Button
        title="Add"
        onPress={() => addDebt({ id: '1', title: 'Test Debt', amount: '100', type: 'Tarjeta', dueDate: '01/01', description: '', isPaid: false })}
        testID="add-btn"
      />
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides empty debts initially and allows adding a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, queryByText, getByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Wait for the async effect in DebtContext to complete
    await act(async () => { await Promise.resolve(); });

    expect(queryByText('Test Debt')).toBeNull();

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByText('Test Debt')).toBeTruthy();
  });
});
