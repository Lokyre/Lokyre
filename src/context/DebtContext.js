import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

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
      console.error("Error loading debts", e);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error("Error saving debts", e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      id: uuidv4(),
      title: debtData.title,
      amount: parseFloat(debtData.amount),
      type: debtData.type, // 'Tarjetas', 'Créditos', 'Personas', 'Individuales'
      isPaid: false,
      notes: debtData.notes || '',
      date: new Date().toISOString(),
    };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const editDebt = async (id, updatedData) => {
    const newDebts = debts.map((debt) => {
      if (debt.id === id) {
        return {
          ...debt,
          ...updatedData,
          amount: parseFloat(updatedData.amount) || debt.amount,
        };
      }
      return debt;
    });
    await saveDebts(newDebts);
  };

  const togglePaidStatus = async (id) => {
    const newDebts = debts.map((debt) => {
      if (debt.id === id) {
        return { ...debt, isPaid: !debt.isPaid };
      }
      return debt;
    });
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((debt) => debt.id !== id);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider
      value={{ debts, addDebt, editDebt, togglePaidStatus, deleteDebt }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
