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
      const storedDebts = await AsyncStorage.getItem('debts');
      if (storedDebts) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (error) {
      console.error('Error loading debts', error);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Error saving debts', error);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false };
    const updatedDebts = [...debts, newDebt];
    await saveDebts(updatedDebts);
  };

  const updateDebt = async (id, updatedDebt) => {
    const updatedDebts = debts.map((debt) => (debt.id === id ? { ...debt, ...updatedDebt } : debt));
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    await saveDebts(updatedDebts);
  };

  const markAsPaid = async (id) => {
    const updatedDebts = debts.map((debt) => (debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt));
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, markAsPaid }}>
      {children}
    </DebtContext.Provider>
  );
};
