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
    } catch (error) {
      console.error('Error loading debts', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (error) {
      console.error('Error saving debts', error);
    }
  };

  const addDebt = (debtData) => {
    const newDebt = {
      ...debtData,
      id: uuidv4(),
      isPaid: false,
    };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const editDebt = (id, updatedData) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, ...updatedData } : debt
    );
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const deleteDebt = (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const togglePaid = (id) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    );
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        editDebt,
        deleteDebt,
        togglePaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
