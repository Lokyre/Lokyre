import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      const jsonValue = await AsyncStorage.getItem('@debts_data');
      if (jsonValue != null) {
        setDebts(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Error loading debts", e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      const jsonValue = JSON.stringify(debtsToSave);
      await AsyncStorage.setItem('@debts_data', jsonValue);
    } catch (e) {
      console.error("Error saving debts", e);
    }
  };

  const addDebt = (debt) => {
    setDebts((prevDebts) => [...prevDebts, { ...debt, id: uuidv4(), createdAt: new Date().toISOString() }]);
  };

  const updateDebt = (updatedDebt) => {
    setDebts((prevDebts) => prevDebts.map(debt => debt.id === updatedDebt.id ? updatedDebt : debt));
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter(debt => debt.id !== id));
  };

  const markAsPaid = (id) => {
    setDebts((prevDebts) => prevDebts.map(debt => debt.id === id ? { ...debt, isPaid: true, paidAt: new Date().toISOString() } : debt));
  };

  const markAsUnpaid = (id) => {
    setDebts((prevDebts) => prevDebts.map(debt => debt.id === id ? { ...debt, isPaid: false, paidAt: null } : debt));
  };

  return (
    <DebtContext.Provider value={{ debts, isLoaded, addDebt, updateDebt, deleteDebt, markAsPaid, markAsUnpaid }}>
      {children}
    </DebtContext.Provider>
  );
};
