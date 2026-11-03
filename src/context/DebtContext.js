import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
        if (storedDebts) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Failed to load debts', error);
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
        } catch (error) {
          console.error('Failed to save debts', error);
        }
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debt) => {
    setDebts((prev) => [...prev, { ...debt, id: uuidv4() }]);
  };

  const editDebt = (id, updatedDebt) => {
    setDebts((prev) => prev.map((debt) => (debt.id === id ? { ...debt, ...updatedDebt } : debt)));
  };

  const deleteDebt = (id) => {
    setDebts((prev) => prev.filter((debt) => debt.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, isLoaded, addDebt, editDebt, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
