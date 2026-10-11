import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

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
      const jsonValue = await AsyncStorage.getItem('@debts');
      if (jsonValue != null) {
        setDebts(JSON.parse(jsonValue));
      }
      setIsLoaded(true);
    } catch (e) {
      console.error('Error loading debts:', e);
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      const jsonValue = JSON.stringify(debtsToSave);
      await AsyncStorage.setItem('@debts', jsonValue);
    } catch (e) {
      console.error('Error saving debts:', e);
    }
  };

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4(), date: new Date().toISOString(), paid: false };
    setDebts([...debts, newDebt]);
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const togglePaid = (id) => {
    setDebts(debts.map(debt => debt.id === id ? { ...debt, paid: !debt.paid } : debt));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, deleteDebt, togglePaid, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
