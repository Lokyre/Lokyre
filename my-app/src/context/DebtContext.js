import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const ASYNC_STORAGE_KEY = '@debts_data';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
      if (storedDebts) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (error) {
      console.error('Error loading debts:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEY, JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Error saving debts:', error);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      id: uuidv4(),
      ...debtData,
      isPaid: false,
    };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const editDebt = async (id, updatedData) => {
    const newDebts = debts.map((debt) => (debt.id === id ? { ...debt, ...updatedData } : debt));
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((debt) => debt.id !== id);
    await saveDebts(newDebts);
  };

  const toggleDebtStatus = async (id) => {
    const newDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    );
    await saveDebts(newDebts);
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
