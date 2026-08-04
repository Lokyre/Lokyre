import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts) {
        const parsedDebts = JSON.parse(storedDebts);
        if (parsedDebts != null) {
          setDebts(parsedDebts);
        }
      }
    } catch (error) {
      console.error('Failed to load debts', error);
    } finally {
      setIsReady(true);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Failed to save debts', error);
    }
  };

  const addDebt = async (debt) => {
    const newDebts = [...debts, debt];
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    await saveDebts(newDebts);
  };

  const toggleDebtStatus = async (id) => {
    const newDebts = debts.map(debt =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    );
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, deleteDebt, toggleDebtStatus, isReady }}>
      {children}
    </DebtContext.Provider>
  );
};
