import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react-native';
import { DebtProvider, useDebts } from './DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = ({ onLoaded }) => {
  const { debts, addDebt, deleteDebt, loading } = useDebts();

  useEffect(() => {
    if (!loading) {
      onLoaded({ debts, addDebt, deleteDebt });
    }
  }, [loading, debts, addDebt, deleteDebt]);

  return null;
};

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage initially', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 100, category: 'tarjetas' }];
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockDebts));

    let contextData;

    render(
      <DebtProvider>
        <TestComponent onLoaded={(data) => { contextData = data; }} />
      </DebtProvider>
    );
    await act(async () => {});

    expect(contextData.debts).toEqual(mockDebts);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    let contextData;

    render(
      <DebtProvider>
        <TestComponent onLoaded={(data) => { contextData = data; }} />
      </DebtProvider>
    );
    await act(async () => {});

    await act(async () => {
      await contextData.addDebt({ title: 'New Debt', amount: 50, category: 'creditos' });
    });

    expect(contextData.debts).toHaveLength(1);
    expect(contextData.debts[0].title).toBe('New Debt');
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });
});
