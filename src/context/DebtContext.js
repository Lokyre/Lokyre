import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Failed to load debts from storage', e);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error('Failed to save debts to storage', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = { ...debtData, id: uuidv4(), dateAdded: new Date().toISOString() };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const updateDebt = async (id, updatedData) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, ...updatedData } : debt);
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
