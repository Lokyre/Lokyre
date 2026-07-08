import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      console.error('Error loading debts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Error saving debts:', error);
    }
  };

  const addDebt = async (debt) => {
    const newDebts = [...debts, debt];
    await saveDebts(newDebts);
  };

  const updateDebt = async (id, updatedDebt) => {
    const newDebts = debts.map((debt) => (debt.id === id ? { ...debt, ...updatedDebt } : debt));
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((debt) => debt.id !== id);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        isLoading,
        addDebt,
        updateDebt,
        deleteDebt,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
