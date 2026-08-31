import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const DEBTS_STORAGE_KEY = '@debts_list';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadDebts();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveDebts(debts);
    }
  }, [debts, isLoaded]);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
      if (storedDebts) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Error loading debts:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      const jsonValue = JSON.stringify(debtsToSave);
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving debts:', e);
    }
  };

  const addDebt = (debtData) => {
    const newDebt = {
      ...debtData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setDebts(prev => [...prev, newDebt]);
  };

  const updateDebt = (id, updatedData) => {
    setDebts(prev =>
      prev.map(debt => (debt.id === id ? { ...debt, ...updatedData } : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
