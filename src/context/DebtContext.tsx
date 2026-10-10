import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext<any>(null);

export const DebtProvider = ({ children }: any) => {
  const [debts, setDebts] = useState<any[]>([]);
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
      console.error('Failed to load debts.', e);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveDebts = async (debtsToSave: any) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(debtsToSave));
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = (debtData: any) => {
    const newDebt = {
      id: uuidv4(),
      title: debtData.title,
      amount: parseFloat(debtData.amount) || 0,
      type: debtData.type || 'Individuales', // Tarjetas, Créditos, Personas, Individuales
      dueDate: debtData.dueDate || new Date().toISOString(),
      isPaid: false,
      notes: debtData.notes || '',
    };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const updateDebt = (id: any, updatedData: any) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) => (debt.id === id ? { ...debt, ...updatedData, amount: parseFloat(updatedData.amount) || debt.amount } : debt))
    );
  };

  const deleteDebt = (id: any) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const toggleDebtStatus = (id: any) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) => (debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt))
    );
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        isLoaded,
        addDebt,
        updateDebt,
        deleteDebt,
        toggleDebtStatus,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
