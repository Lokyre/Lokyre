import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const useDebtContext = () => useContext(DebtContext);

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

  const addDebt = (description, amount, type, dueDate) => {
    const newDebt = {
      id: uuidv4(),
      description,
      amount: parseFloat(amount),
      type,
      dueDate: dueDate || null,
      isPaid: false,
      createdAt: new Date().toISOString(),
    };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const markAsPaid = (id) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: true } : debt
      )
    );
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, isLoaded, addDebt, markAsPaid, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
