import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from AsyncStorage when component mounts
  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null && storedDebts !== undefined) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (error) {
      console.error('Error loading debts', error);
    } finally {
      setLoading(false);
    }
  };

  const addDebt = async (debt) => {
    try {
      const newDebt = { ...debt, id: uuidv4(), date: new Date().toISOString() };
      const newDebts = [...debts, newDebt];
      setDebts(newDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (error) {
      console.error('Error adding debt', error);
    }
  };

  const removeDebt = async (id) => {
    try {
      const newDebts = debts.filter((debt) => debt.id !== id);
      setDebts(newDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (error) {
      console.error('Error removing debt', error);
    }
  };

  const updateDebt = async (id, updatedData) => {
    try {
      const newDebts = debts.map((debt) => (debt.id === id ? { ...debt, ...updatedData } : debt));
      setDebts(newDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (error) {
      console.error('Error updating debt', error);
    }
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, removeDebt, updateDebt }}>
      {children}
    </DebtContext.Provider>
  );
};