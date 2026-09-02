import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

const DEBTS_STORAGE_KEY = '@debts_data';

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
        if (storedDebts !== null) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Failed to load debts from storage', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadDebts();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const saveDebts = async () => {
        try {
          await AsyncStorage.setItem(DEBTS_STORAGE_KEY, JSON.stringify(debts));
        } catch (error) {
          console.error('Failed to save debts to storage', error);
        }
      };
      saveDebts();
    }
  }, [debts, isLoaded]);

  const addDebt = (debtData) => {
    const newDebt = {
      ...debtData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const removeDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const updateDebt = (id, updatedData) => {
      setDebts((prevDebts) => prevDebts.map((debt) => debt.id === id ? { ...debt, ...updatedData } : debt));
  }

  const getTotalDebtAmount = () => {
    return debts.reduce((total, debt) => total + Number(debt.amount || 0), 0);
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        isLoaded,
        addDebt,
        removeDebt,
        updateDebt,
        getTotalDebtAmount,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
