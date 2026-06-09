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
        const storedDebts = await AsyncStorage.getItem('debts');
        if (storedDebts) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Failed to load debts', error);
      } finally {
        setLoading(false);
      }
    };

    loadDebts();
  }, []);

  // Save debts to AsyncStorage whenever they change
  useEffect(() => {
    const saveDebts = async () => {
      if (!loading) {
        try {
          await AsyncStorage.setItem('debts', JSON.stringify(debts));
        } catch (error) {
          console.error('Failed to save debts', error);
        }
      }
    };

    saveDebts();
  }, [debts, loading]);

  const addDebt = (debtData) => {
    const newDebt = {
      ...debtData,
      id: uuidv4(),
      isPaid: false,
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id, updatedData) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, ...updatedData } : debt)));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  const toggleDebtStatus = (id) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt)));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, toggleDebtStatus, loading }}>
      {children}
    </DebtContext.Provider>
  );
};
