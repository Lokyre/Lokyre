import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

const DEBTS_STORAGE_KEY = '@debts_v1';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
      if (storedDebts !== null && storedDebts !== undefined) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Failed to load debts:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(newDebts));
    } catch (e) {
      console.error('Failed to save debts:', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false, createdAt: new Date().toISOString() };
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const updateDebt = async (id, updatedFields) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, ...updatedFields } : debt);
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const togglePaidStatus = async (id) => {
    const debt = debts.find(d => d.id === id);
    if (debt) {
        await updateDebt(id, { isPaid: !debt.isPaid });
    }
  }

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt, togglePaidStatus }}>
      {children}
    </DebtContext.Provider>
  );
};
