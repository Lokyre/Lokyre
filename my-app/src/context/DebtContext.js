import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();
const STORAGE_KEY = '@debts_data';

export const useDebts = () => {
  return useContext(DebtContext);
};

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from AsyncStorage when the component mounts
  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      setLoading(true);
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null && jsonValue !== 'undefined') {
        setDebts(JSON.parse(jsonValue));
      } else {
        setDebts([]);
      }
    } catch (e) {
      console.error('Error loading debts:', e);
      setDebts([]); // Default to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      const jsonValue = JSON.stringify(newDebts);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
      setDebts(newDebts);
    } catch (e) {
      console.error('Error saving debts:', e);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      id: uuidv4(),
      title: debtData.title,
      amount: parseFloat(debtData.amount),
      type: debtData.type, // 'Tarjeta', 'Crédito', 'Persona', 'Individual'
      dueDate: debtData.dueDate,
      description: debtData.description,
      isPaid: false,
    };
    const updatedDebts = [...debts, newDebt];
    await saveDebts(updatedDebts);
  };

  const updateDebt = async (id, updatedData) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, ...updatedData, amount: parseFloat(updatedData.amount) } : debt
    );
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = debts.filter((debt) => debt.id !== id);
    await saveDebts(updatedDebts);
  };

  const togglePaid = async (id) => {
    const updatedDebts = debts.map((debt) =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    );
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        updateDebt,
        deleteDebt,
        togglePaid,
        loadDebts, // Expose for testing if needed
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
