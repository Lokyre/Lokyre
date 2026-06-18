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
      if (storedDebts !== null && storedDebts !== undefined) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Failed to load debts.', e);
    } finally {
      setLoading(false);
    }
  };

  const addDebt = async (debt) => {
    try {
      const newDebt = { ...debt, id: uuidv4(), isPaid: false };
      const updatedDebts = [...debts, newDebt];
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Failed to save debt.', e);
    }
  };

  const deleteDebt = async (id) => {
    try {
      const updatedDebts = debts.filter(debt => debt.id !== id);
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Failed to delete debt.', e);
    }
  };

  const markAsPaid = async (id) => {
    try {
      const updatedDebts = debts.map(debt =>
        debt.id === id ? { ...debt, isPaid: true } : debt
      );
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Failed to update debt.', e);
    }
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, deleteDebt, markAsPaid }}>
      {children}
    </DebtContext.Provider>
  );
};
