import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const DEBTS_STORAGE_KEY = '@debts_list';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
      if (jsonValue !== null && jsonValue !== undefined) {
        setDebts(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load debts from storage', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      const jsonValue = JSON.stringify(newDebts);
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, jsonValue);
      setDebts(newDebts);
    } catch (e) {
      console.error('Failed to save debts to storage', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      ...debtData,
      id: uuidv4(),
      isPaid: false,
    };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    await saveDebts(newDebts);
  };

  const togglePaidStatus = async (id) => {
    const newDebts = debts.map(debt =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    );
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, deleteDebt, togglePaidStatus }}>
      {children}
    </DebtContext.Provider>
  );
};
