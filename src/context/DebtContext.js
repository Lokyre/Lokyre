import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts_data');
        if (storedDebts !== null) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Failed to load debts:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadDebts();
  }, []);

  useEffect(() => {
    const saveDebts = async () => {
      if (!isLoaded) return;
      try {
        await AsyncStorage.setItem('@debts_data', JSON.stringify(debts));
      } catch (error) {
        console.error('Failed to save debts:', error);
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (description, amount, category) => {
    const newDebt = {
      id: uuidv4(),
      description,
      amount: parseFloat(amount),
      category,
      isPaid: false,
      date: new Date().toISOString(),
    };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const removeDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const markAsPaid = (id) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: true } : debt
      )
    );
  };

  const totalPending = debts
    .filter((debt) => !debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <DebtContext.Provider
      value={{
        debts,
        isLoaded,
        addDebt,
        removeDebt,
        markAsPaid,
        totalPending,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export const useDebt = () => useContext(DebtContext);
