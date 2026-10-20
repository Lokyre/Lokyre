import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

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
        console.error('Error loading debts:', error);
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
        await AsyncStorage.setItem('debts', JSON.stringify(debts));
      } catch (error) {
        console.error('Error saving debts:', error);
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debt) => {
    const newDebt = {
      ...debt,
      id: uuidv4(),
      date: new Date().toISOString(),
      isPaid: false,
    };
    setDebts([...debts, newDebt]);
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const togglePaid = (id) => {
    setDebts(debts.map(debt =>
      debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
    ));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, deleteDebt, togglePaid, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
