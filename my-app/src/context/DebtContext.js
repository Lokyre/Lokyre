import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from AsyncStorage when the app starts
  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts_list');
        if (storedDebts !== null) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Failed to load debts from AsyncStorage', error);
      } finally {
        setLoading(false);
      }
    };
    loadDebts();
  }, []);

  // Save debts to AsyncStorage whenever the debts list changes
  useEffect(() => {
    const saveDebts = async () => {
      try {
        await AsyncStorage.setItem('@debts_list', JSON.stringify(debts));
      } catch (error) {
        console.error('Failed to save debts to AsyncStorage', error);
      }
    };
    if (!loading) {
      saveDebts();
    }
  }, [debts, loading]);

  const addDebt = (debtData) => {
    const newDebt = {
      id: uuidv4(),
      ...debtData,
      createdAt: new Date().toISOString(),
      isPaid: false,
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
    <DebtContext.Provider value={{ debts, addDebt, markAsPaid, deleteDebt, loading }}>
      {children}
    </DebtContext.Provider>
  );
};
