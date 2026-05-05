import 'react-native-get-random-values';
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);

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
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4(), dateAdded: new Date().toISOString() };
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const editDebt = async (id, updatedDebt) => {
    const newDebts = debts.map(d => (d.id === id ? { ...d, ...updatedDebt } : d));
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(d => d.id !== id);
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const markAsPaid = async (id) => {
    const newDebts = debts.map(d => (d.id === id ? { ...d, status: 'paid' } : d));
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, editDebt, deleteDebt, markAsPaid }}>
      {children}
    </DebtContext.Provider>
  );
};
