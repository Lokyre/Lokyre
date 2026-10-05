import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

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
      console.error('Error loading debts:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(debtsToSave));
    } catch (e) {
      console.error('Error saving debts:', e);
    }
  };

  const addDebt = (debt) => {
    setDebts([...debts, debt]);
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const markAsPaid = (id) => {
     setDebts(debts.map(debt => debt.id === id ? { ...debt, isPaid: true } : debt));
  }

  return (
    <DebtContext.Provider value={{ debts, isLoaded, addDebt, deleteDebt, markAsPaid }}>
      {children}
    </DebtContext.Provider>
  );
};
