import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
        if (storedDebts !== null && storedDebts !== undefined) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error("Error loading debts from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDebts();
  }, []);

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error("Error saving debts to AsyncStorage:", error);
    }
  };

  const addDebt = async (debt) => {
    const newDebts = [...debts, debt];
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    await saveDebts(newDebts);
  };

  const toggleDebtPaid = async (id) => {
    const newDebts = debts.map(debt => {
      if (debt.id === id) {
        return { ...debt, isPaid: !debt.isPaid };
      }
      return debt;
    });
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, deleteDebt, toggleDebtPaid }}>
      {children}
    </DebtContext.Provider>
  );
};
