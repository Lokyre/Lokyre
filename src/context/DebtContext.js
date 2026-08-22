import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
        if (storedDebts !== null && storedDebts !== undefined) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (e) {
        console.error("Error loading debts", e);
      } finally {
        setLoading(false);
      }
    };
    loadDebts();
  }, []);

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error("Error saving debts", e);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const updateDebt = async (id, updatedDebt) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, ...updatedDebt } : debt);
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    await saveDebts(newDebts);
  };

  const toggleDebtStatus = async (id) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt, toggleDebtStatus }}>
      {children}
    </DebtContext.Provider>
  );
};
