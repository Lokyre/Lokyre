import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { DebtProvider, useDebts } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

describe('DebtContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load debts on mount', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 100, isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const wrapper = ({ children }) => <DebtProvider>{children}</DebtProvider>;
    const { result } = renderHook(() => useDebts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(result.current.debts).toEqual(mockDebts);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@debts');
  });

  it('should add a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const wrapper = ({ children }) => <DebtProvider>{children}</DebtProvider>;
    const { result } = renderHook(() => useDebts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.addDebt({
        title: 'New Debt',
        amount: 200,
        type: 'Créditos',
        description: 'Test description',
      });
    });

    expect(result.current.debts.length).toBe(1);
    expect(result.current.debts[0].title).toBe('New Debt');
    expect(result.current.debts[0].amount).toBe(200);
    expect(result.current.debts[0].type).toBe('Créditos');
    expect(result.current.debts[0].description).toBe('Test description');
    expect(result.current.debts[0].isPaid).toBe(false);
    expect(result.current.debts[0].id).toBeDefined();
    expect(result.current.debts[0].createdAt).toBeDefined();
  });

  it('should update and pay a debt', async () => {
    const mockDebts = [
      { id: '1', title: 'Test Debt', amount: 100, isPaid: false },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const wrapper = ({ children }) => <DebtProvider>{children}</DebtProvider>;
    const { result } = renderHook(() => useDebts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.payDebt('1');
    });

    expect(result.current.debts[0].isPaid).toBe(true);
  });

  it('should delete a debt', async () => {
    const mockDebts = [
      { id: '1', title: 'Test Debt', amount: 100, isPaid: false },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const wrapper = ({ children }) => <DebtProvider>{children}</DebtProvider>;
    const { result } = renderHook(() => useDebts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.deleteDebt('1');
    });

    expect(result.current.debts.length).toBe(0);
  });
});
