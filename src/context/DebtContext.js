import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DebtContext = createContext();

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
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Error loading debts', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      const jsonValue = JSON.stringify(debtsToSave);
      await AsyncStorage.setItem('@debts', jsonValue);
    } catch (e) {
      console.error('Error saving debts', e);
    }
  };

  const addDebt = (debt) => {
    setDebts([...debts, debt]);
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const editDebt = (id, updatedDebt) => {
    setDebts(debts.map(debt => debt.id === id ? { ...debt, ...updatedDebt } : debt));
  }

  return (
    <DebtContext.Provider value={{ debts, addDebt, deleteDebt, editDebt, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
