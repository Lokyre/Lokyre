import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);

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
      console.error('Failed to load debts.', e);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = (title, amount, type) => {
    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      type, // 'tarjeta', 'credito', 'persona', 'individual'
      isPaid: false,
      createdAt: new Date().toISOString(),
    };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const removeDebt = (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  const togglePaid = (id) => {
    const updatedDebts = debts.map((debt) => {
      if (debt.id === id) {
        return { ...debt, isPaid: !debt.isPaid };
      }
      return debt;
    });
    setDebts(updatedDebts);
    saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        addDebt,
        removeDebt,
        togglePaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
