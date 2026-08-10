import React, { useContext, useEffect } from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = ({ action, payload }) => {
  const { debts, addDebt, updateDebt, deleteDebt, loading } = useContext(DebtContext);

  useEffect(() => {
    if (!loading) {
      if (action === 'add' && debts.length === 0) {
        addDebt(payload);
      } else if (action === 'update' && debts.length > 0 && debts[0].title === 'Old') {
        updateDebt(debts[0].id, payload);
      } else if (action === 'delete' && debts.length > 0) {
        deleteDebt(debts[0].id);
      }
    }
  }, [loading, debts.length, action]);

  if (loading) return <Text testID="loading">Loading...</Text>;

  return (
    <>
      <Text testID="debt-count">{debts.length}</Text>
      {debts.map(d => (
        <Text key={d.id} testID={`debt-title-${d.title}`}>{d.title}</Text>
      ))}
    </>
  );
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent action="add" payload={{ title: 'New Debt', amount: 100 }} />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(1);
    }, { timeout: 4000 });

    expect(getByTestId('debt-title-New Debt')).toBeTruthy();
  });

  it('updates a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'Old', amount: 50 }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent action="update" payload={{ title: 'Updated Debt' }} />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-title-Updated Debt')).toBeTruthy();
    }, { timeout: 4000 });
  });

  it('deletes a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ id: '1', title: 'To Delete', amount: 50 }]));

    const { getByTestId } = render(
      <DebtProvider>
        <TestComponent action="delete" />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('debt-count').props.children).toBe(0);
    }, { timeout: 4000 });
  });
});
