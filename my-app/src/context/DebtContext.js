import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const DEBTS_STORAGE_KEY = '@debts_list';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts on mount
  useEffect(() => {
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
    loadDebts();
  }, []);

  // Add a new debt
  const addDebt = async (debtData) => {
    try {
      const newDebt = {
        id: uuidv4(),
        ...debtData,
        status: 'Pendiente', // Default status
        createdAt: new Date().toISOString(),
      };

      const updatedDebts = [...debts, newDebt];
      setDebts(updatedDebts);
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Failed to add debt:', error);
    }
  };

  // Update a debt (e.g. mark as paid)
  const updateDebt = async (id, updatedData) => {
    try {
      const updatedDebts = debts.map((debt) =>
        debt.id === id ? { ...debt, ...updatedData } : debt
      );
      setDebts(updatedDebts);
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Failed to update debt:', error);
    }
  };

  // Delete a debt
  const deleteDebt = async (id) => {
    try {
      const updatedDebts = debts.filter((debt) => debt.id !== id);
      setDebts(updatedDebts);
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Failed to delete debt:', error);
    }
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        updateDebt,
        deleteDebt,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
