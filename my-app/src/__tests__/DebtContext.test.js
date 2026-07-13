import React, { useContext } from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import { Text, Button } from 'react-native';
import { DebtProvider, DebtContext } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt } = useContext(DebtContext);

  return (
    <>
      <Text testID="debt-count">{debts.length}</Text>
      <Button title="Add" testID="btn-add" onPress={() => addDebt({ title: 'New Debt', amount: 100, type: 'Individual', dueDate: '2024-01-01' })} />
      {debts.map(d => (
        <Button key={d.id} title={`Delete ${d.id}`} testID={`btn-del-${d.id}`} onPress={() => deleteDebt(d.id)} />
      ))}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '123', title: 'Test', amount: 50, type: 'Tarjeta', dueDate: '2023-10-10', isPaid: false }]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads initial debts from AsyncStorage', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('debt-count').props.children).toBe(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('adds a new debt', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      fireEvent.press(getByTestId('btn-add'));
    });

    expect(getByTestId('debt-count').props.children).toBe(2);
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
