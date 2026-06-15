import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider, DebtContext } from './DebtContext';

const TestComponent = () => {
  const { debts, addDebt, editDebt, deleteDebt, toggleDebtStatus, loading } = useContext(DebtContext);

  if (loading) return <Text testID="loading">Loading</Text>;

  return (
    <View>
      <Text testID="debts-length">{debts.length}</Text>
      {debts.map(d => (
        <View key={d.id}>
          <Text testID={`debt-title-${d.id}`}>{d.title}</Text>
          <Text testID={`debt-amount-${d.id}`}>{d.amount}</Text>
          <Text testID={`debt-status-${d.id}`}>{d.isPaid ? 'Pagado' : 'Pendiente'}</Text>
        </View>
      ))}
      <Text
        testID="add-btn"
        onPress={() => addDebt({ title: 'New Debt', amount: 100, type: 'Tarjeta', dueDate: '2023-12-01', description: 'Test' })}
      >
        Add
      </Text>
      {debts.length > 0 && (
        <>
          <Text testID="edit-btn" onPress={() => editDebt(debts[0].id, { title: 'Updated Debt' })}>
            Edit
          </Text>
          <Text testID="toggle-btn" onPress={() => toggleDebtStatus(debts[0].id)}>
            Toggle
          </Text>
          <Text testID="delete-btn" onPress={() => deleteDebt(debts[0].id)}>
            Delete
          </Text>
        </>
      )}
    </View>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage on mount', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '1', title: 'Test', amount: 50, isPaid: false }]));

    const { getByTestId, findByText } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    expect(getByTestId('debts-length').props.children).toBe(1);
    expect(getByTestId('debt-title-1').props.children).toBe('Test');
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      getByTestId('add-btn').props.onPress();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    expect(getByTestId('debts-length').props.children).toBe(1);
  });

  it('edits an existing debt', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '1', title: 'Old Debt', amount: 50, isPaid: false }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      getByTestId('edit-btn').props.onPress();
    });

    expect(getByTestId('debt-title-1').props.children).toBe('Updated Debt');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('toggles debt status', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '1', title: 'Test', amount: 50, isPaid: false }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      getByTestId('toggle-btn').props.onPress();
    });

    expect(getByTestId('debt-status-1').props.children).toBe('Pagado');
  });

  it('deletes a debt', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ id: '1', title: 'Test', amount: 50, isPaid: false }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      getByTestId('delete-btn').props.onPress();
    });

    expect(getByTestId('debts-length').props.children).toBe(0);
  });
});
