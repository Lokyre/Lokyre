import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem('@debts');
      if (jsonValue != null && jsonValue !== 'undefined') {
        setDebts(JSON.parse(jsonValue));
      } else {
        setDebts([]);
      }
    } catch (e) {
      console.error('Error loading debts:', e);
    } finally {
      setLoading(false);
    }
  };

  const addDebt = async (debtData) => {
    try {
      const newDebt = {
        ...debtData,
        id: uuidv4(),
        isPaid: false,
      };
      const updatedDebts = [...debts, newDebt];
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error saving debt:', e);
    }
  };

  const updateDebt = async (id, updatedData) => {
    try {
      const updatedDebts = debts.map((debt) =>
        debt.id === id ? { ...debt, ...updatedData } : debt
      );
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error updating debt:', e);
    }
  };

  const deleteDebt = async (id) => {
    try {
      const updatedDebts = debts.filter((debt) => debt.id !== id);
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error deleting debt:', e);
    }
  };

  const toggleDebtStatus = async (id) => {
    try {
      const updatedDebts = debts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
      );
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error toggling debt status:', e);
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
        toggleDebtStatus,
        loadDebts,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
