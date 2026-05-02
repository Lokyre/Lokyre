import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from AsyncStorage when the app starts
  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts_data');
      if (storedDebts !== null) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Failed to load debts from storage', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebtsToStorage = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts_data', JSON.stringify(newDebts));
    } catch (e) {
      console.error('Failed to save debts to storage', e);
    }
  };

  const addDebt = async (debtDetails) => {
    const newDebt = {
      ...debtDetails,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      isPaid: false,
    };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    await saveDebtsToStorage(updatedDebts);
  };

  const updateDebt = async (id, updatedDetails) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, ...updatedDetails } : debt
    );
    setDebts(updatedDebts);
    await saveDebtsToStorage(updatedDebts);
  };

  const markAsPaid = async (id) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, isPaid: true, paidAt: new Date().toISOString() } : debt
    );
    setDebts(updatedDebts);
    await saveDebtsToStorage(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    setDebts(updatedDebts);
    await saveDebtsToStorage(updatedDebts);
  };

  const getTotalOwed = () => {
    return debts
      .filter((d) => !d.isPaid)
      .reduce((total, debt) => total + parseFloat(debt.amount || 0), 0);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        updateDebt,
        markAsPaid,
        deleteDebt,
        getTotalOwed,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
