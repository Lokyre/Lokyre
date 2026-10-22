import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

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
      } catch (error) {
        console.error('Failed to load debts from AsyncStorage', error);
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
        console.error('Failed to save debts to AsyncStorage', error);
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (name, amount, type) => {
    const newDebt = {
      id: uuidv4(),
      name,
      amount: parseFloat(amount),
      type, // 'Tarjetas', 'Créditos', 'Personas', 'Individuales'
      date: new Date().toISOString(),
      isPaid: false,
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const toggleDebtPaid = (id) => {
    setDebts(
      debts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
      )
    );
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, removeDebt, toggleDebtPaid, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
