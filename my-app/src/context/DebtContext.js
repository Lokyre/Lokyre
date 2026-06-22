import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

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
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      id: uuidv4(),
      ...debtData,
      isPaid: false,
    };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const updateDebt = async (id, updatedData) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, ...updatedData } : debt
    );
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const markAsPaid = async (id) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, isPaid: true } : debt
    );
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        updateDebt,
        deleteDebt,
        markAsPaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export const useDebtContext = () => useContext(DebtContext);
