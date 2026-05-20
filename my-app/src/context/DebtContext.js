import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from AsyncStorage when the provider mounts
  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts_list');
        if (storedDebts !== null) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Failed to load debts from storage', error);
      } finally {
        setLoading(false);
      }
    };

    loadDebts();
  }, []);

  // Save debts to AsyncStorage whenever they change
  useEffect(() => {
    const saveDebts = async () => {
      try {
        await AsyncStorage.setItem('@debts_list', JSON.stringify(debts));
      } catch (error) {
        console.error('Failed to save debts to storage', error);
      }
    };

    if (!loading) {
        saveDebts();
    }
  }, [debts, loading]);

  const addDebt = (debtData) => {
    const newDebt = {
      id: uuidv4(),
      title: debtData.title,
      amount: parseFloat(debtData.amount),
      category: debtData.category,
      description: debtData.description,
      createdAt: new Date().toISOString(),
    };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const updateDebt = (id, updatedData) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.id === id ? { ...debt, ...updatedData, amount: parseFloat(updatedData.amount) } : debt
      )
    );
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const getTotalDebt = () => {
      return debts.reduce((sum, debt) => sum + debt.amount, 0);
  }

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt, getTotalDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
