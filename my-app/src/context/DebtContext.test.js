import React, { useContext } from 'react';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from './DebtContext';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A simple test component to consume the context
const TestComponent = () => {
  const { debts, addDebt, deleteDebt, togglePaid } = useContext(DebtContext);

  return (
    <>
      <Text testID="debts-length">{debts.length}</Text>
      <Text testID="add-debt" onPress={() => addDebt({ description: 'Test', amount: 100, type: 'individual' })}>Add</Text>
      <Text testID="delete-debt" onPress={() => deleteDebt(debts[0]?.id)}>Delete</Text>
      <Text testID="toggle-paid" onPress={() => togglePaid(debts[0]?.id)}>Toggle Paid</Text>
      {debts.map(d => (
        <Text key={d.id} testID={`debt-${d.id}`}>{d.description} - {d.paid ? 'Paid' : 'Unpaid'}</Text>
      ))}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('provides empty debts initially and allows adding a debt', async () => {
    const { getByTestId, findByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    // Initial state (might be 0 before load resolves, though mock is fast)
    expect(getByTestId('debts-length').props.children).toBe(0);

    // Add a debt
    await act(async () => {
      getByTestId('add-debt').props.onPress();
    });

    // Check if debt was added (length should be 1)
    expect(getByTestId('debts-length').props.children).toBe(1);

    // Check if AsyncStorage was called to save
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('allows toggling paid status', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      getByTestId('add-debt').props.onPress();
    });

    // Toggle paid
    await act(async () => {
      getByTestId('toggle-paid').props.onPress();
    });

    expect(getByTestId('debt-12345-abcde-67890').props.children.join('')).toContain('Test - Paid');
  });

  it('allows deleting a debt', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => {
      getByTestId('add-debt').props.onPress();
    });

    expect(getByTestId('debts-length').props.children).toBe(1);

    await act(async () => {
      getByTestId('delete-debt').props.onPress();
    });

    expect(getByTestId('debts-length').props.children).toBe(0);
  });
});
