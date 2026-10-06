import React, { createContext, useState, useEffect } from 'react';
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
    } catch (e) {
      console.error('Error loading debts:', e);
    } finally {
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
    const newDebt = { ...debt, id: uuidv4() };
    setDebts([...debts, newDebt]);
  };

  const editDebt = (id, updatedDebt) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, ...updatedDebt } : d)));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter((d) => d.id !== id));
  };

  const toggleDebtStatus = (id) => {
     setDebts(debts.map((d) => {
         if (d.id === id) {
             return { ...d, isPaid: !d.isPaid };
         }
         return d;
     }));
  }

  return (
    <DebtContext.Provider
      value={{
        debts,
        addDebt,
        editDebt,
        deleteDebt,
        toggleDebtStatus,
        isLoaded,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
