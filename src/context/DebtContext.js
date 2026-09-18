import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebtContext = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadDebts();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveDebts(debts);
    }
  }, [debts, isLoaded]);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts_data');
      if (storedDebts !== null) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Failed to load debts from storage', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      const jsonValue = JSON.stringify(debtsToSave);
      await AsyncStorage.setItem('@debts_data', jsonValue);
    } catch (e) {
      console.error('Failed to save debts to storage', e);
    }
  };

  const addDebt = (debt) => {
    const newDebt = {
      id: uuidv4(),
      ...debt,
      createdAt: new Date().toISOString(),
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id, updatedDebt) => {
    setDebts(
      debts.map((debt) => (debt.id === id ? { ...debt, ...updatedDebt } : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  const getCategorizedDebts = () => {
    const categorized = {
      'Tarjetas': [],
      'Créditos': [],
      'Personas': [],
      'Individuales': []
    };

    debts.forEach(debt => {
      if (categorized[debt.category]) {
        categorized[debt.category].push(debt);
      } else {
        // Fallback for uncategorized or custom categories
         categorized['Individuales'].push(debt);
      }
    });

    return categorized;
  };

  const getTotalDebt = () => {
     return debts.reduce((sum, debt) => sum + parseFloat(debt.amount || 0), 0);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        isLoaded,
        addDebt,
        updateDebt,
        deleteDebt,
        getCategorizedDebts,
        getTotalDebt,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
