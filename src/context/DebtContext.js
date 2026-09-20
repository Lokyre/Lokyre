import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebtContext = () => useContext(DebtContext);

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
        console.error('Error loading debts', e);
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
      } catch (e) {
        console.error('Error saving debts', e);
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debt) => {
    setDebts((prev) => [...prev, { ...debt, id: uuidv4(), isPaid: false }]);
  };

  const updateDebt = (id, updatedFields) => {
    setDebts((prev) =>
      prev.map((debt) => (debt.id === id ? { ...debt, ...updatedFields } : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts((prev) => prev.filter((debt) => debt.id !== id));
  };

  const markAsPaid = (id) => {
    updateDebt(id, { isPaid: true });
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, markAsPaid, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
