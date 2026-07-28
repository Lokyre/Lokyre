import React, { useContext } from 'react';
import { Text } from 'react-native';
import { render, act, fireEvent } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = () => {
  const { debts, addDebt, deleteDebt, markAsPaid } = useContext(DebtContext);

  return (
    <>
      <Text testID="debt-count">{debts.length}</Text>
      <Text testID="add-btn" onPress={() => addDebt({ title: 'Test Debt', amount: 100, type: 'Individual' })}>
        Add
      </Text>
      {debts.length > 0 && (
        <>
          <Text testID="delete-btn" onPress={() => deleteDebt(debts[0].id)}>Delete</Text>
          <Text testID="pay-btn" onPress={() => markAsPaid(debts[0].id)}>Pay</Text>
          <Text testID="paid-status">{debts[0].isPaid ? 'Paid' : 'Unpaid'}</Text>
        </>
      )}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts on mount', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Debt 1' }]));

    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(getByTestId('debt-count').props.children).toBe(1);
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    expect(getByTestId('debt-count').props.children).toBe(0);

    await act(async () => {
      fireEvent.press(getByTestId('add-btn'));
    });

    expect(getByTestId('debt-count').props.children).toBe(1);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts',
      expect.stringContaining('Test Debt')
    );
  });

  it('marks debt as paid', async () => {
    const mockDebt = { id: 'mocked-uuid', title: 'Test', isPaid: false };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockDebt]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });
    expect(getByTestId('paid-status').props.children).toBe('Unpaid');

    await act(async () => {
      fireEvent.press(getByTestId('pay-btn'));
    });

    expect(getByTestId('paid-status').props.children).toBe('Paid');
  });

  it('deletes a debt', async () => {
    const mockDebt = { id: 'mocked-uuid', title: 'Test' };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([mockDebt]));

    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <TestComponent />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });
    expect(getByTestId('debt-count').props.children).toBe(1);

    await act(async () => {
      fireEvent.press(getByTestId('delete-btn'));
    });

    expect(getByTestId('debt-count').props.children).toBe(0);
  });
});
