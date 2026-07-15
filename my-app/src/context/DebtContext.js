import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      console.error('Error loading debts:', error);
    } finally {
      setLoading(false);
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

  const editDebt = async (updatedDebt) => {
    const newDebts = debts.map(d => d.id === updatedDebt.id ? updatedDebt : d);
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(d => d.id !== id);
    await saveDebts(newDebts);
  };

  const togglePaid = async (id) => {
    const newDebts = debts.map(d => {
      if (d.id === id) {
        return { ...d, isPaid: !d.isPaid };
      }
      return d;
    });
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
        togglePaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
