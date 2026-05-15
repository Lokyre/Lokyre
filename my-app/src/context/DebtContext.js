import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

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
      console.error('Failed to load debts.', e);
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

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4() };
    const newDebts = [...debts, newDebt];
    saveDebts(newDebts);
  };

  const updateDebt = (updatedDebt) => {
    const newDebts = debts.map((debt) =>
      debt.id === updatedDebt.id ? updatedDebt : debt
    );
    saveDebts(newDebts);
  };

  const deleteDebt = (id) => {
    const newDebts = debts.filter((debt) => debt.id !== id);
    saveDebts(newDebts);
  };

  const toggleStatus = (id) => {
    const newDebts = debts.map((debt) => {
      if (debt.id === id) {
        return { ...debt, isPaid: !debt.isPaid };
      }
      return debt;
    });
    saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        addDebt,
        updateDebt,
        deleteDebt,
        toggleStatus,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
