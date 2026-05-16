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
        const storedDebts = await AsyncStorage.getItem('@debts');
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

  // Save debts to AsyncStorage whenever debts state changes
  useEffect(() => {
    const saveDebts = async () => {
      try {
        await AsyncStorage.setItem('@debts', JSON.stringify(debts));
      } catch (error) {
        console.error('Failed to save debts to AsyncStorage', error);
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
      createdAt: new Date().toISOString(),
      paid: false,
    };
    setDebts([...debts, newDebt]);
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  const toggleDebtStatus = (id) => {
    setDebts(
      debts.map((debt) =>
        debt.id === id ? { ...debt, paid: !debt.paid } : debt
      )
    );
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        addDebt,
        deleteDebt,
        toggleDebtStatus,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
