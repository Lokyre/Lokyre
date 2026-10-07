import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const useDebts = () => {
  return useContext(DebtContext);
};

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

  const addDebt = (description, amount, category) => {
    const newDebt = {
      id: uuidv4(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
    };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const removeDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, removeDebt, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
