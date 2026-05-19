import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from AsyncStorage when component mounts
  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('debts');
        if (storedDebts) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Failed to load debts from storage', error);
      } finally {
        setLoading(false);
      }
    };
    loadDebts();
  }, []);

  // Save debts to AsyncStorage whenever the debts state changes
  useEffect(() => {
    const saveDebts = async () => {
      try {
        await AsyncStorage.setItem('debts', JSON.stringify(debts));
      } catch (error) {
        console.error('Failed to save debts to storage', error);
      }
    };
    if (!loading) {
      saveDebts();
    }
  }, [debts, loading]);

  const addDebt = (debt) => {
    const newDebt = {
      ...debt,
      id: uuidv4(),
      status: 'pending', // pending or paid
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (updatedDebt) => {
    setDebts(debts.map(debt => debt.id === updatedDebt.id ? updatedDebt : debt));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const markAsPaid = (id) => {
    setDebts(debts.map(debt => debt.id === id ? { ...debt, status: 'paid' } : debt));
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        addDebt,
        updateDebt,
        deleteDebt,
        markAsPaid,
        loading
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
