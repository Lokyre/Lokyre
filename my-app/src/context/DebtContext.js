import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const DEBTS_STORAGE_KEY = '@debts_list';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
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
      console.error('Failed to load debts.', e);
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
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      id: uuidv4(),
      ...debtData,
      isPaid: false,
    };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const updateDebt = async (id, updatedData) => {
    const updatedDebts = debts.map(debt =>
      debt.id === id ? { ...debt, ...updatedData } : debt
    );
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter(debt => debt.id !== id);
    await saveDebts(updatedDebts);
  };

  const toggleDebtPaid = async (id) => {
    const updatedDebts = debts.map(debt =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    );
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt, toggleDebtPaid }}>
      {children}
    </DebtContext.Provider>
  );
};
