import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const STORAGE_KEY = '@debts_data';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedDebts !== null && storedDebts !== undefined) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Error loading debts:', e);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(debtsToSave));
    } catch (e) {
      console.error('Error saving debts:', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      id: uuidv4(),
      ...debtData,
      isPaid: false,
      date: new Date().toISOString(),
    };
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const togglePaid = async (id) => {
    const newDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    );
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((debt) => debt.id !== id);
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, togglePaid, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
