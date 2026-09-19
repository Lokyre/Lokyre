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
      console.error('Failed to load debts.', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(debtsToSave));
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: Date.now().toString(), paid: false };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (updatedDebt) => {
    setDebts(debts.map(debt => (debt.id === updatedDebt.id ? updatedDebt : debt)));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const markAsPaid = (id) => {
    setDebts(debts.map(debt => (debt.id === id ? { ...debt, paid: true } : debt)));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, markAsPaid, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
