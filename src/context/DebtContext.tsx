import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Debt } from '../types/Debt';

interface DebtContextData {
  debts: Debt[];
  isLoaded: boolean;
  addDebt: (debt: Omit<Debt, 'id'>) => Promise<void>;
  updateDebt: (debt: Debt) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
}

export const DebtContext = createContext<DebtContextData>({
  debts: [],
  isLoaded: false,
  addDebt: async () => {},
  updateDebt: async () => {},
  deleteDebt: async () => {},
});

interface DebtProviderProps {
  children: ReactNode;
}

const DEBTS_STORAGE_KEY = '@debts';

export const DebtProvider = ({ children }: DebtProviderProps) => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
      if (jsonValue != null) {
        setDebts(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Error loading debts from AsyncStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (newDebts: Debt[]) => {
    try {
      const jsonValue = JSON.stringify(newDebts);
      await AsyncStorage.setItem(DEBTS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving debts to AsyncStorage:', e);
    }
  };

  const addDebt = async (debtData: Omit<Debt, 'id'>) => {
    const newDebt: Debt = {
      ...debtData,
      id: uuidv4(),
    };
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const updateDebt = async (updatedDebt: Debt) => {
    const newDebts = debts.map(debt => (debt.id === updatedDebt.id ? updatedDebt : debt));
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const deleteDebt = async (id: string) => {
    const newDebts = debts.filter(debt => debt.id !== id);
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, isLoaded, addDebt, updateDebt, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
