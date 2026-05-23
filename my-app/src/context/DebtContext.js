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
      if (storedDebts) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Error loading debts', e);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error('Error saving debts', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = {
      ...debt,
      id: uuidv4(),
      payments: debt.payments || [],
    };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const editDebt = async (id, updatedDebt) => {
    const newDebts = debts.map(debt => debt.id === id ? { ...debt, ...updatedDebt } : debt);
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    await saveDebts(newDebts);
  };

  const addPayment = async (debtId, amount) => {
    const payment = {
      id: uuidv4(),
      amount: parseFloat(amount),
      date: new Date().toISOString(),
    };

    const newDebts = debts.map(debt => {
      if (debt.id === debtId) {
        return {
          ...debt,
          payments: [...(debt.payments || []), payment]
        };
      }
      return debt;
    });

    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, editDebt, deleteDebt, addPayment }}>
      {children}
    </DebtContext.Provider>
  );
};
