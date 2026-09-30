import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
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
        await AsyncStorage.setItem('@debts', JSON.stringify(debts));
      } catch (error) {
        console.error('Failed to save debts:', error);
      }
    };

    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debt) => {
    setDebts((prevDebts) => [...prevDebts, debt]);
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, deleteDebt, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
