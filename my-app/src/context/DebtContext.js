import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const STORAGE_KEY = '@debts';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem(STORAGE_KEY);
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDebts));
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
    const updatedDebts = [...debts, newDebt];
    await saveDebts(updatedDebts);
  };

  const editDebt = async (id, updatedData) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, ...updatedData } : debt
    );
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    await saveDebts(updatedDebts);
  };

  const toggleDebtStatus = async (id) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    );
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        editDebt,
        deleteDebt,
        toggleDebtStatus,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
