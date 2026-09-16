import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const STORAGE_KEY = '@debts';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedDebts) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (e) {
        console.error('Failed to load debts', e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadDebts();
  }, []);

  useEffect(() => {
    const saveDebts = async () => {
      if (!isLoaded) return;
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(debts));
      } catch (e) {
        console.error('Failed to save debts', e);
      }
    };

    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (title, amount, category) => {
    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
    };
    setDebts((prev) => [...prev, newDebt]);
  };

  const editDebt = (id, title, amount, category) => {
    setDebts((prev) =>
      prev.map((debt) =>
        debt.id === id
          ? { ...debt, title, amount: parseFloat(amount), category }
          : debt
      )
    );
  };

  const deleteDebt = (id) => {
    setDebts((prev) => prev.filter((debt) => debt.id !== id));
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        isLoaded,
        addDebt,
        editDebt,
        deleteDebt,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
