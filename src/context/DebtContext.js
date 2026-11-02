import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
        if (storedDebts) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (e) {
        console.error('Failed to load debts.', e);
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
        } catch (e) {
          console.error('Failed to save debts.', e);
        }
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debt) => {
    setDebts((prev) => [...prev, { ...debt, id: uuidv4() }]);
  };

  const updateDebt = (updatedDebt) => {
    setDebts((prev) =>
      prev.map((d) => (d.id === updatedDebt.id ? updatedDebt : d))
    );
  };

  const deleteDebt = (id) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
