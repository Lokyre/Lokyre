import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'uuid';

export const DebtContext = createContext();

const DEBTS_KEY = '@debts_v1';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(DEBTS_KEY);
      if (jsonValue != null) {
        const loadedDebts = JSON.parse(jsonValue);
        // Make sure loaded data isn't undefined (catch parse errors if it was saved oddly)
        setDebts(Array.isArray(loadedDebts) ? loadedDebts : []);
      }
    } catch (e) {
      console.error('Error loading debts from AsyncStorage', e);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      setDebts(newDebts);
      const jsonValue = JSON.stringify(newDebts);
      await AsyncStorage.setItem(DEBTS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving debts to AsyncStorage', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      ...debtData,
      id: uuid.v4(),
      isPaid: false,
      createdAt: new Date().toISOString()
    };
    const newDebts = [...debts, newDebt];
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
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        deleteDebt,
        toggleDebtPaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
