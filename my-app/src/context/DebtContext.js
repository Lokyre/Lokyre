import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from AsyncStorage
  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts) {
        const parsed = JSON.parse(storedDebts);
        if (parsed !== null && parsed !== undefined) {
          setDebts(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load debts.', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebts();
  }, []);

  // Save to AsyncStorage
  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebts = [...debts, debt];
    await saveDebts(newDebts);
  };

  const updateDebt = async (id, updatedDebt) => {
    const newDebts = debts.map((debt) => (debt.id === id ? { ...debt, ...updatedDebt } : debt));
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id) => {
    const newDebts = debts.filter((debt) => debt.id !== id);
    await saveDebts(newDebts);
  };

  const toggleDebtPaid = async (id) => {
    const newDebts = debts.map((debt) => {
      if (debt.id === id) {
        return { ...debt, isPaid: !debt.isPaid };
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
        updateDebt,
        deleteDebt,
        toggleDebtPaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export const useDebtContext = () => useContext(DebtContext);
