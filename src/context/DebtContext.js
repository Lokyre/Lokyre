import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load debts from AsyncStorage when the app starts
  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
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

  // Save debts to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      const saveDebts = async () => {
        try {
          await AsyncStorage.setItem('@debts', JSON.stringify(debts));
        } catch (error) {
          console.error('Failed to save debts to storage', error);
        }
      };
      saveDebts();
    }
  }, [debts, isLoaded]);

  const addDebt = (debtDetails) => {
    const newDebt = {
      id: uuidv4(),
      ...debtDetails,
      dateAdded: new Date().toISOString(),
      isPaid: false,
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id, updatedDetails) => {
    const updatedDebts = debts.map(debt =>
      debt.id === id ? { ...debt, ...updatedDetails } : debt
    );
    setDebts(updatedDebts);
  };

  const deleteDebt = (id) => {
    const updatedDebts = debts.filter(debt => debt.id !== id);
    setDebts(updatedDebts);
  };

  const markAsPaid = (id) => {
      const updatedDebts = debts.map(debt =>
          debt.id === id ? { ...debt, isPaid: true } : debt
      );
      setDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, isLoaded, addDebt, updateDebt, deleteDebt, markAsPaid }}>
      {children}
    </DebtContext.Provider>
  );
};

export const useDebtContext = () => useContext(DebtContext);
