import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { DebtProvider, useDebts } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper component to wrap hook
const wrapper = ({ children }) => <DebtProvider>{children}</DebtProvider>;

describe('DebtContext', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('should load debts initially from AsyncStorage', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 100, type: 'Tarjeta' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { result } = renderHook(() => useDebts(), { wrapper });

    // Wait for useEffect to finish
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
    expect(result.current.debts).toEqual(mockDebts);
  });

  it('should add a debt', async () => {
    const { result } = renderHook(() => useDebts(), { wrapper });

    await act(async () => {
      await result.current.addDebt('New Debt', '200', 'Crédito');
    });

    expect(result.current.debts).toHaveLength(1);
    expect(result.current.debts[0].title).toBe('New Debt');
    expect(result.current.debts[0].amount).toBe(200);
    expect(result.current.debts[0].type).toBe('Crédito');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@debts',
      expect.stringContaining('New Debt')
    );
  });

  it('should delete a debt', async () => {
    const { result } = renderHook(() => useDebts(), { wrapper });

    // First add a debt
    await act(async () => {
      await result.current.addDebt('Debt to delete', '50', 'Otro');
    });

    const addedDebtId = result.current.debts[0].id;

    // Then delete it
    await act(async () => {
      await result.current.deleteDebt(addedDebtId);
    });

    expect(result.current.debts).toHaveLength(0);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@debts', '[]');
  });

  it('should update a debt', async () => {
    const { result } = renderHook(() => useDebts(), { wrapper });

    // First add a debt
    await act(async () => {
      await result.current.addDebt('Old Debt', '10', 'Persona');
    });

    const addedDebtId = result.current.debts[0].id;

    // Then update it
    await act(async () => {
      await result.current.updateDebt(addedDebtId, 'Updated Debt', '20', 'Tarjeta');
    });

    expect(result.current.debts).toHaveLength(1);
    expect(result.current.debts[0].title).toBe('Updated Debt');
    expect(result.current.debts[0].amount).toBe(20);
    expect(result.current.debts[0].type).toBe('Tarjeta');
  });
});
