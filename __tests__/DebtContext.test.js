import React, { useContext, useEffect } from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TestComponent = ({ onLoaded }) => {
  const { debts, isLoaded, addDebt, editDebt, deleteDebt } = useContext(DebtContext);

  useEffect(() => {
    if (isLoaded && onLoaded) {
      onLoaded({ debts, addDebt, editDebt, deleteDebt });
    }
  }, [isLoaded, debts]);

  return null;
};

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads debts from AsyncStorage initially', async () => {
    const mockDebts = [{ id: '1', title: 'Test', amount: 100, category: 'Otros', date: '2023-01-01' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    let contextData;
    render(
      <DebtProvider>
        <TestComponent onLoaded={(data) => { contextData = data; }} />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(contextData).toBeDefined();
    });

    expect(contextData.debts).toEqual(mockDebts);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('adds a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    let contextData;
    render(
      <DebtProvider>
        <TestComponent onLoaded={(data) => { contextData = data; }} />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(contextData).toBeDefined();
    });

    act(() => {
      contextData.addDebt('New Debt', '50.5', 'Personas');
    });

    await waitFor(() => {
      expect(contextData.debts.length).toBe(1);
      expect(contextData.debts[0].title).toBe('New Debt');
      expect(contextData.debts[0].amount).toBe(50.5);
      expect(contextData.debts[0].category).toBe('Personas');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('edits an existing debt', async () => {
    const initialDebts = [{ id: '1', title: 'Old', amount: 10, category: 'Otros' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(initialDebts));

    let contextData;
    render(
      <DebtProvider>
        <TestComponent onLoaded={(data) => { contextData = data; }} />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(contextData).toBeDefined();
      expect(contextData.debts.length).toBe(1);
    });

    act(() => {
      contextData.editDebt('1', 'New Title', '20', 'Tarjetas');
    });

    await waitFor(() => {
      expect(contextData.debts[0].title).toBe('New Title');
      expect(contextData.debts[0].amount).toBe(20);
      expect(contextData.debts[0].category).toBe('Tarjetas');
    });
  });

  it('deletes a debt', async () => {
    const initialDebts = [{ id: '1', title: 'Old', amount: 10, category: 'Otros' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(initialDebts));

    let contextData;
    render(
      <DebtProvider>
        <TestComponent onLoaded={(data) => { contextData = data; }} />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(contextData).toBeDefined();
    });

    act(() => {
      contextData.deleteDebt('1');
    });

    await waitFor(() => {
      expect(contextData.debts.length).toBe(0);
    });
  });
});
