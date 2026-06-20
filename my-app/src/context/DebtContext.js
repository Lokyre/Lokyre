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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveDebts(debts);
    }
  }, [debts, loading]);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts) {
        const parsedDebts = JSON.parse(storedDebts);
        if (parsedDebts !== null && parsedDebts !== undefined) {
           setDebts(parsedDebts);
        }
      }
    } catch (e) {
      console.error('Failed to load debts from storage', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(debtsToSave));
    } catch (e) {
      console.error('Failed to save debts to storage', e);
    }
  };

  const addDebt = (debtData) => {
    const newDebt = {
      id: uuidv4(),
      ...debtData,
      isPaid: false,
    };
    setDebts((prev) => [...prev, newDebt]);
  };

  const updateDebt = (id, updatedData) => {
    setDebts((prev) =>
      prev.map((debt) => (debt.id === id ? { ...debt, ...updatedData } : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts((prev) => prev.filter((debt) => debt.id !== id));
  };

  const toggleDebtPaid = (id) => {
    setDebts((prev) =>
      prev.map((debt) =>
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
        updateDebt,
        deleteDebt,
        toggleDebtPaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
