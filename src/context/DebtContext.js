import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

const DEBTS_STORAGE_KEY = '@debts_key';

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
      const jsonValue = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
      if (jsonValue != null) {
        setDebts(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load debts:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      const jsonValue = JSON.stringify(debtsToSave);
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save debts:', e);
    }
  };

  const addDebt = (debt) => {
    const newDebt = {
      ...debt,
      id: uuidv4(),
    };
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
