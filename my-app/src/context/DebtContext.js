import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from storage
  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
        if (storedDebts !== null) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (e) {
        console.error('Failed to load debts.', e);
      } finally {
        setLoading(false);
      }
    };
    loadDebts();
  }, []);

  // Save debts to storage whenever they change
  useEffect(() => {
    const saveDebts = async () => {
      try {
        await AsyncStorage.setItem('@debts', JSON.stringify(debts));
      } catch (e) {
        console.error('Failed to save debts.', e);
      }
    };
    if (!loading) {
      saveDebts();
    }
  }, [debts, loading]);

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false, createdAt: new Date().toISOString() };
    setDebts([...debts, newDebt]);
  };

  const editDebt = (updatedDebt) => {
    setDebts(debts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt)));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  const toggleDebtStatus = (id) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt)));
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        addDebt,
        editDebt,
        deleteDebt,
        toggleDebtStatus,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
