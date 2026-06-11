import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from local storage
  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts_data');
      if (storedDebts) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (error) {
      console.error('Failed to load debts', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebts();
  }, []);

  // Save debts to local storage
  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts_data', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Failed to save debts', error);
    }
  };

  // Add a new debt
  const addDebt = async (debtData) => {
    const newDebt = {
      id: uuidv4(),
      ...debtData,
      isPaid: false,
    };
    const newDebtsList = [...debts, newDebt];
    await saveDebts(newDebtsList);
  };

  // Edit an existing debt
  const editDebt = async (id, updatedData) => {
    const newDebtsList = debts.map((debt) =>
      debt.id === id ? { ...debt, ...updatedData } : debt
    );
    await saveDebts(newDebtsList);
  };

  // Delete a debt
  const deleteDebt = async (id) => {
    const newDebtsList = debts.filter((debt) => debt.id !== id);
    await saveDebts(newDebtsList);
  };

  // Toggle paid status
  const togglePaidStatus = async (id) => {
    const newDebtsList = debts.map((debt) =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    );
    await saveDebts(newDebtsList);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        editDebt,
        deleteDebt,
        togglePaidStatus,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
