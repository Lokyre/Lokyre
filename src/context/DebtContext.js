import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

const DEBTS_STORAGE_KEY = '@mydebtsapp_debts';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
      if (storedDebts) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Failed to load debts from AsyncStorage', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      const jsonValue = JSON.stringify(newDebts);
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save debts to AsyncStorage', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      id: uuidv4(),
      title: debtData.title,
      type: debtData.type || 'Individual',
      amount: parseFloat(debtData.amount),
      dueDate: debtData.dueDate || '',
      payments: [],
      notes: debtData.notes || '',
      createdAt: new Date().toISOString(),
    };
    const updatedDebts = [...debts, newDebt];
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const updateDebt = async (id, updatedData) => {
    const updatedDebts = debts.map(debt =>
      debt.id === id ? { ...debt, ...updatedData, amount: parseFloat(updatedData.amount || debt.amount) } : debt
    );
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter(debt => debt.id !== id);
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  const addPayment = async (debtId, paymentData) => {
    const newPayment = {
      id: uuidv4(),
      amount: parseFloat(paymentData.amount),
      date: paymentData.date || new Date().toISOString(),
      notes: paymentData.notes || '',
    };
    const updatedDebts = debts.map(debt => {
      if (debt.id === debtId) {
        return {
          ...debt,
          payments: [...(debt.payments || []), newPayment]
        };
      }
      return debt;
    });
    setDebts(updatedDebts);
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, isLoaded, addDebt, updateDebt, deleteDebt, addPayment }}>
      {children}
    </DebtContext.Provider>
  );
};
