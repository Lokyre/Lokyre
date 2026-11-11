import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categorías de deuda requeridas: 'Tarjetas', 'Créditos', 'Personas', 'Individuales'

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
      console.error('Failed to load debts', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      const jsonValue = JSON.stringify(newDebts);
      await AsyncStorage.setItem('@debts', jsonValue);
      setDebts(newDebts);
    } catch (e) {
      console.error('Failed to save debts', e);
    }
  };

  const addDebt = (title, amount, category) => {
    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
    };
    const updatedDebts = [...debts, newDebt];
    saveDebts(updatedDebts);
  };

  const editDebt = (id, updatedTitle, updatedAmount, updatedCategory) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id
        ? {
            ...debt,
            title: updatedTitle,
            amount: parseFloat(updatedAmount),
            category: updatedCategory,
          }
        : debt
    );
    saveDebts(updatedDebts);
  };

  const deleteDebt = (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        editDebt,
        deleteDebt,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
