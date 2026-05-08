import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      console.error('Failed to load debts from storage', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error('Failed to save debts to storage', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4(), date: new Date().toISOString(), isPaid: false };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const updateDebt = async (id, updatedDebt) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, ...updatedDebt } : debt);
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    await saveDebts(newDebts);
  };

  const markAsPaid = async (id) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, isPaid: true } : debt);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, markAsPaid, loading }}>
      {children}
    </DebtContext.Provider>
  );
};
