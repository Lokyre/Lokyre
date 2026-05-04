import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from AsyncStorage when the provider mounts
  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
        if (storedDebts !== null) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Error loading debts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDebts();
  }, []);

  // Save debts to AsyncStorage whenever the debts array changes
  useEffect(() => {
    const saveDebts = async () => {
      try {
        await AsyncStorage.setItem('@debts', JSON.stringify(debts));
      } catch (error) {
        console.error('Error saving debts:', error);
      }
    };

    if (!loading) {
        saveDebts();
    }
  }, [debts, loading]);

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false, createdAt: new Date().toISOString() };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const updateDebt = (updatedDebt) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt))
    );
  };

  const markAsPaid = (id) => {
      setDebts((prevDebts) =>
        prevDebts.map((debt) => (debt.id === id ? { ...debt, isPaid: true } : debt))
      );
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, deleteDebt, updateDebt, markAsPaid }}>
      {children}
    </DebtContext.Provider>
  );
};
