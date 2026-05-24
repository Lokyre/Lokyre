import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebtContext = () => useContext(DebtContext);

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
    } catch (e) {
      console.error('Error loading debts:', e);
    } finally {
      setLoading(false);
    }
  };

  const addDebt = async (debtData) => {
    try {
      const newDebt = {
        id: uuidv4(),
        ...debtData,
        createdAt: new Date().toISOString(),
      };
      const updatedDebts = [...debts, newDebt];
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
      setDebts(updatedDebts);
    } catch (e) {
      console.error('Error adding debt:', e);
    }
  };

  const deleteDebt = async (id) => {
    try {
      const updatedDebts = debts.filter(debt => debt.id !== id);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
      setDebts(updatedDebts);
    } catch (e) {
      console.error('Error deleting debt:', e);
    }
  };

  const updateDebt = async (id, updatedData) => {
    try {
      const updatedDebts = debts.map(debt =>
        debt.id === id ? { ...debt, ...updatedData } : debt
      );
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
      setDebts(updatedDebts);
    } catch (e) {
      console.error('Error updating debt:', e);
    }
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, deleteDebt, updateDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
