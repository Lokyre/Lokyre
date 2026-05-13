import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      console.error('Failed to load debts from storage', e);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (e) {
      console.error('Failed to save debts to storage', e);
    }
  };

  const addDebt = (debt) => {
    const updatedDebts = [...debts, debt];
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const updateDebt = (updatedDebt) => {
    const updatedDebts = debts.map(d => (d.id === updatedDebt.id ? updatedDebt : d));
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const deleteDebt = (id) => {
    const updatedDebts = debts.filter(d => d.id !== id);
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
