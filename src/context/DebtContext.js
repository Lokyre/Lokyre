import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('debts');
        if (storedDebts) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Failed to load debts from AsyncStorage', error);
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
          await AsyncStorage.setItem('debts', JSON.stringify(debts));
        } catch (error) {
          console.error('Failed to save debts to AsyncStorage', error);
        }
      };
      saveDebts();
    }
  }, [debts, isLoaded]);

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4() };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id, updatedDebt) => {
    setDebts(debts.map(debt => debt.id === id ? { ...debt, ...updatedDebt } : debt));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, isLoaded, addDebt, updateDebt, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
