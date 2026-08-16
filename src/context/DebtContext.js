import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
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
      if (storedDebts) {
        setDebts(JSON.parse(storedDebts));
      } else {
        setDebts([]);
      }
    } catch (e) {
      console.error('Error loading debts:', e);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error('Error saving debts:', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      id: uuidv4(),
      ...debtData,
      isPaid: false, // by default not paid
    };
    const updatedDebts = [...debts, newDebt];
    await saveDebts(updatedDebts);
  };

  const updateDebt = async (id, updatedData) => {
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
        addDebt,
        updateDebt,
        deleteDebt,
        toggleDebtStatus,
        loadDebts,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
