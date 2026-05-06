import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
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
      console.error('Failed to load debts from AsyncStorage', e);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      const jsonValue = JSON.stringify(newDebts);
      await AsyncStorage.setItem('@debts', jsonValue);
    } catch (e) {
      console.error('Failed to save debts to AsyncStorage', e);
    }
  };

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const removeDebt = (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const editDebt = (id, updatedDebt) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, ...updatedDebt } : debt
    );
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const markAsPaid = (id) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, isPaid: true } : debt
    );
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider
      value={{ debts, addDebt, removeDebt, editDebt, markAsPaid, loadDebts }}
    >
      {children}
    </DebtContext.Provider>
  );
};
