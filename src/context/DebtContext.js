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
      if (storedDebts) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (error) {
      console.error('Error loading debts', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (error) {
      console.error('Error saving debts', error);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false, createdAt: new Date().toISOString() };
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const updateDebt = async (updatedDebt) => {
    const newDebts = debts.map((d) => (d.id === updatedDebt.id ? updatedDebt : d));
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const removeDebt = async (id) => {
    const newDebts = debts.filter((d) => d.id !== id);
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const markAsPaid = async (id) => {
    const newDebts = debts.map((d) => (d.id === id ? { ...d, isPaid: true } : d));
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, removeDebt, markAsPaid }}>
      {children}
    </DebtContext.Provider>
  );
};
