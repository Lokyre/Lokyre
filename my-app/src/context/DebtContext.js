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
      const storedDebts = await AsyncStorage.getItem('@debts_list');
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
      await AsyncStorage.setItem('@debts_list', JSON.stringify(newDebts));
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4(), date: new Date().toISOString() };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const updateDebt = async (id, updatedFields) => {
    const updatedDebts = debts.map(debt => debt.id === id ? { ...debt, ...updatedFields } : debt);
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter(debt => debt.id !== id);
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
