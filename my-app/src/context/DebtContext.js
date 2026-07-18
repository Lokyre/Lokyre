import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isReady, setIsReady] = useState(false);

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
      setIsReady(true);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = (debt) => {
    const newDebts = [...debts, debt];
    setDebts(newDebts);
    saveDebts(newDebts);
  };

  const updateDebt = (updatedDebt) => {
    const newDebts = debts.map((d) => (d.id === updatedDebt.id ? updatedDebt : d));
    setDebts(newDebts);
    saveDebts(newDebts);
  };

  const deleteDebt = (id) => {
    const newDebts = debts.filter((d) => d.id !== id);
    setDebts(newDebts);
    saveDebts(newDebts);
  };

  const markAsPaid = (id) => {
    const newDebts = debts.map((d) => (d.id === id ? { ...d, isPaid: true } : d));
    setDebts(newDebts);
    saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        isReady,
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
