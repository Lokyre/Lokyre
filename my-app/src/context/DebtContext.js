import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Failed to load debts.', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      const jsonValue = JSON.stringify(newDebts);
      await AsyncStorage.setItem('@debts', jsonValue);
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      ...debtData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      paidAmount: 0,
      isPaid: false,
    };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const updateDebt = async (id, updatedData) => {
    const updatedDebts = debts.map(debt =>
      debt.id === id ? { ...debt, ...updatedData } : debt
    );
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter(debt => debt.id !== id);
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
