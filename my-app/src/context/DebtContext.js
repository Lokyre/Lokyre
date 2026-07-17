import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DebtContext = createContext();

const ASYNC_STORAGE_KEY = '@debts_v1';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      if (jsonValue !== null && jsonValue !== undefined) {
        setDebts(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load debts.', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      const jsonValue = JSON.stringify(newDebts);
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, jsonValue);
      setDebts(newDebts);
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebts = [...debts, debt];
    await saveDebts(newDebts);
  };

  const toggleDebtStatus = async (id) => {
    const newDebts = debts.map((debt) => {
      if (debt.id === id) {
        return { ...debt, isPaid: !debt.isPaid };
      }
      return debt;
    });
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((debt) => debt.id !== id);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider
      value={{ debts, isLoading, addDebt, toggleDebtStatus, deleteDebt }}
    >
      {children}
    </DebtContext.Provider>
  );
};
