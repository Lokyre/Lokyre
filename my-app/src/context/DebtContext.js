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
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null && storedDebts !== undefined) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Failed to load debts', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error('Failed to save debts', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4() };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const updateDebt = async (id, updatedDebt) => {
    const newDebts = debts.map((d) => (d.id === id ? { ...d, ...updatedDebt } : d));
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((d) => d.id !== id);
    await saveDebts(newDebts);
  };

  const togglePaidStatus = async (id) => {
    const newDebts = debts.map((d) => (d.id === id ? { ...d, isPaid: !d.isPaid } : d));
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt, togglePaidStatus }}>
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
