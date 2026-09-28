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
        const storedDebts = await AsyncStorage.getItem('@debts_data');
        if (storedDebts !== null) {
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
    if (isLoaded) {
      const saveDebts = async () => {
        try {
          await AsyncStorage.setItem('@debts_data', JSON.stringify(debts));
        } catch (error) {
          console.error('Error saving debts:', error);
        }
      };
      saveDebts();
    }
  }, [debts, isLoaded]);

  const addDebt = (concepto, monto, tipo) => {
    const newDebt = {
      id: uuidv4(),
      concepto,
      monto: parseFloat(monto),
      tipo,
      isPaid: false,
      date: new Date().toISOString(),
    };
    setDebts([...debts, newDebt]);
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const toggleDebtStatus = (id) => {
    setDebts(
      debts.map(debt =>
        debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
      )
    );
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, deleteDebt, toggleDebtStatus, isLoaded }}>
      {children}
    </DebtContext.Provider>
  );
};
