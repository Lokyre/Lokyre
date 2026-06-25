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
      if (storedDebts) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (error) {
      console.error('Failed to load debts', error);
    } finally {
      setIsReady(true);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Failed to save debts', error);
    }
  };

  const addDebt = async (debt) => {
    const newDebts = [...debts, debt];
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

  const togglePaidStatus = async (id) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, isReady, addDebt, updateDebt, deleteDebt, togglePaidStatus }}>
      {children}
    </DebtContext.Provider>
  );
};
