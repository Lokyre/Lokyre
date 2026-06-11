import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, useDebts } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper component to access context
const ContextTester = ({ onContextReady }) => {
  const context = useDebts();

  useEffect(() => {
    if (context && !context.loading) {
      onContextReady(context);
    }
  }, [context]);

  return <Text testID="tester">Tester</Text>;
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty debts if storage is empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    let contextRef;

    render(
      <DebtProvider>
        <ContextTester onContextReady={(c) => { contextRef = c; }} />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(contextRef.debts).toEqual([]);
    expect(contextRef.loading).toBe(false);
  });

  it('loads debts from storage', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    let contextRef;

    render(
      <DebtProvider>
        <ContextTester onContextReady={(c) => { contextRef = c; }} />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(contextRef.debts).toEqual(mockDebts);
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    let contextRef;

    render(
      <DebtProvider>
        <ContextTester onContextReady={(c) => { contextRef = c; }} />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await contextRef.addDebt({ title: 'New Debt', amount: 50, type: 'Individual' });
    });

    expect(contextRef.debts.length).toBe(1);
    expect(contextRef.debts[0].title).toBe('New Debt');
    expect(contextRef.debts[0].isPaid).toBe(false);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts_data',
      expect.any(String)
    );
  });
});
