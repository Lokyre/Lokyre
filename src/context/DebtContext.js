import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
    loadDebts();
  }, []);

  useEffect(() => {
    const saveDebts = async () => {
      if (isLoaded) {
        try {
          await AsyncStorage.setItem('@debts', JSON.stringify(debts));
        } catch (e) {
          console.error('Failed to save debts.', e);
        }
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4(), date: new Date().toISOString() };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const updateDebt = (updatedDebt) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
