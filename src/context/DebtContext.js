import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

const DEBTS_STORAGE_KEY = '@debts_v1';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
      if (storedDebts !== null && storedDebts !== undefined) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (error) {
      console.error('Failed to load debts:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Failed to save debts:', error);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = {
      ...debt,
      id: uuidv4(),
      status: 'pendiente', // pendiente, pagado
    };
    const newDebts = [...debts, newDebt];
    await saveDebts(newDebts);
  };

  const editDebt = async (updatedDebt) => {
    const newDebts = debts.map((debt) =>
      debt.id === updatedDebt.id ? updatedDebt : debt
    );
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((debt) => debt.id !== id);
    await saveDebts(newDebts);
  };

  const toggleDebtStatus = async (id) => {
    const newDebts = debts.map((debt) => {
      if (debt.id === id) {
        return {
          ...debt,
          status: debt.status === 'pendiente' ? 'pagado' : 'pendiente',
        };
      }
      return debt;
    });
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        editDebt,
        deleteDebt,
        toggleDebtStatus,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
