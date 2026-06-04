import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Failed to load debts.', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const updateDebt = async (updatedDebt) => {
    const newDebts = debts.map((d) => (d.id === updatedDebt.id ? updatedDebt : d));
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((d) => d.id !== id);
    await saveDebts(newDebts);
  };

  const markAsPaid = async (id) => {
    const newDebts = debts.map((d) => (d.id === id ? { ...d, isPaid: true } : d));
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider
      value={{ debts, loading, addDebt, updateDebt, deleteDebt, markAsPaid }}
    >
      {children}
    </DebtContext.Provider>
  );
};
