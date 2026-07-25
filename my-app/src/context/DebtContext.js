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
      if (storedDebts !== null && storedDebts !== undefined) {
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
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      ...debtData,
      id: uuidv4(),
      isPaid: false,
    };
    await saveDebts([...debts, newDebt]);
  };

  const updateDebt = async (id, updatedData) => {
    const updatedDebts = debts.map(debt => debt.id === id ? { ...debt, ...updatedData } : debt);
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter(debt => debt.id !== id);
    await saveDebts(updatedDebts);
  };

  const toggleDebtStatus = async (id) => {
    const updatedDebts = debts.map(debt => debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt);
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt, toggleDebtStatus }}>
      {children}
    </DebtContext.Provider>
  );
};