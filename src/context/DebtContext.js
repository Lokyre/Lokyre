import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebtContext = createContext();

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
      if (isLoaded) {
        try {
          await AsyncStorage.setItem('@debts', JSON.stringify(debts));
        } catch (error) {
          console.error('Failed to save debts:', error);
        }
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debt) => {
    setDebts([...debts, { ...debt, id: Date.now().toString() }]);
  };

  const removeDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const updateDebt = (updatedDebt) => {
    setDebts(debts.map(debt => debt.id === updatedDebt.id ? updatedDebt : debt));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, removeDebt, updateDebt, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
