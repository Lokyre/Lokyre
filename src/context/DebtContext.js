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
        if (storedDebts) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Failed to load debts:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadDebts();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const saveDebts = async () => {
        try {
          await AsyncStorage.setItem('@debts', JSON.stringify(debts));
        } catch (error) {
          console.error('Failed to save debts:', error);
        }
      };
      saveDebts();
    }
  }, [debts, isLoaded]);

  const addDebt = (debtData) => {
    const newDebt = {
      id: uuidv4(),
      ...debtData,
      date: new Date().toISOString()
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, removeDebt, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
