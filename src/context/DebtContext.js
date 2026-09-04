import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

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
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Error cargando las deudas', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      const jsonValue = JSON.stringify(debtsToSave);
      await AsyncStorage.setItem('@debts', jsonValue);
    } catch (e) {
      console.error('Error guardando las deudas', e);
    }
  };

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4(), date: new Date().toISOString(), status: 'pending' };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter(debt => debt.id !== id));
  };

  const markAsPaid = (id) => {
    setDebts((prevDebts) => prevDebts.map(debt => debt.id === id ? { ...debt, status: 'paid' } : debt));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, deleteDebt, markAsPaid, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
