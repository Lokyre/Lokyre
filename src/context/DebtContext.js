import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => {
  return useContext(DebtContext);
};

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadDebts();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveDebts(debts);
    }
  }, [debts, isLoaded]);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Failed to load debts.', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      const jsonValue = JSON.stringify(debtsToSave);
      await AsyncStorage.setItem('@debts', jsonValue);
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = (title, amount, type) => {
    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      type,
      isPaid: false,
      date: new Date().toISOString(),
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id, updatedFields) => {
    setDebts(
      debts.map((debt) => (debt.id === id ? { ...debt, ...updatedFields } : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  const toggleDebtPaid = (id) => {
    setDebts(
      debts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
      )
    );
  };

  return (
    <DebtContext.Provider
      value={{ debts, addDebt, updateDebt, deleteDebt, toggleDebtPaid, isLoaded }}
    >
      {children}
    </DebtContext.Provider>
  );
};
