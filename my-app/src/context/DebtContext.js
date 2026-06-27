import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (error) {
      console.error('Failed to load debts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDebt = async (debt) => {
    try {
      const newDebt = { ...debt, id: uuidv4(), isPaid: false };
      const updatedDebts = [...debts, newDebt];
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Failed to add debt:', error);
    }
  };

  const updateDebt = async (updatedDebt) => {
    try {
      const updatedDebts = debts.map((debt) =>
        debt.id === updatedDebt.id ? updatedDebt : debt
      );
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Failed to update debt:', error);
    }
  };

  const deleteDebt = async (id) => {
    try {
      const updatedDebts = debts.filter((debt) => debt.id !== id);
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Failed to delete debt:', error);
    }
  };

  const toggleDebtPaid = async (id) => {
    try {
      const updatedDebts = debts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
      );
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Failed to toggle debt status:', error);
    }
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        updateDebt,
        deleteDebt,
        toggleDebtPaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
