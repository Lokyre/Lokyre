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
    } catch (e) {
      console.error('Error loading debts', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (e) {
      console.error('Error saving debts', e);
    }
  };

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false };
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    saveDebts(newDebts);
  };

  const updateDebt = (id, updatedDebt) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, ...updatedDebt } : debt);
    setDebts(newDebts);
    saveDebts(newDebts);
  };

  const deleteDebt = (id) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    setDebts(newDebts);
    saveDebts(newDebts);
  };

  const toggleDebtStatus = (id) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt);
    setDebts(newDebts);
    saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt, toggleDebtStatus }}>
      {children}
    </DebtContext.Provider>
  );
};
