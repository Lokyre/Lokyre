import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DEBT_TYPES = {
  TARJETAS: 'Tarjetas',
  CREDITOS: 'Créditos',
  PERSONAS: 'Personas',
  INDIVIDUALES: 'Individuales',
};

const STORAGE_KEY = '@debts_data';

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
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setDebts(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Error loading debts', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave) => {
    try {
      const jsonValue = JSON.stringify(debtsToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving debts', e);
    }
  };

  const addDebt = (debt) => {
    const newDebt = { ...debt, id: uuidv4(), date: new Date().toISOString() };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id, updatedDebt) => {
    setDebts(debts.map((debt) => (debt.id === id ? { ...debt, ...updatedDebt } : debt)));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter((debt) => debt.id !== id));
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
