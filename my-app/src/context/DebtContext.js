import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
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
      if (storedDebts) {
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
      setDebts(newDebts);
    } catch (error) {
      console.error('Error saving debts', error);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = {
      ...debt,
      id: uuidv4(),
      isPaid: false,
    };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const editDebt = async (updatedDebt) => {
    const newDebts = debts.map((d) => (d.id === updatedDebt.id ? updatedDebt : d));
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((d) => d.id !== id);
    await saveDebts(newDebts);
  };

  const markAsPaid = async (id, isPaid) => {
    const newDebts = debts.map((d) => (d.id === id ? { ...d, isPaid } : d));
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        editDebt,
        deleteDebt,
        markAsPaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export const useDebt = () => useContext(DebtContext);
