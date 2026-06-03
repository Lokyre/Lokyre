import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const DEBTS_STORAGE_KEY = '@debts_list';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial debts
  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
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

  // Save to AsyncStorage whenever debts state changes
  useEffect(() => {
    if (!loading) {
      const saveDebts = async () => {
        try {
          await AsyncStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(debts));
        } catch (error) {
          console.error('Error saving debts:', error);
        }
      };
      saveDebts();
    }
  }, [debts, loading]);

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4(), isPaid: false };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const editDebt = (id, updatedDebt) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) => (debt.id === id ? { ...debt, ...updatedDebt } : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const toggleDebtPaidStatus = (id) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
      )
    );
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        editDebt,
        deleteDebt,
        toggleDebtPaidStatus,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
