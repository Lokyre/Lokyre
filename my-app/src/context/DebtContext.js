import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts from AsyncStorage on mount
  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
        if (storedDebts) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Error loading debts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDebts();
  }, []);

  // Save debts to AsyncStorage whenever they change
  useEffect(() => {
    const saveDebts = async () => {
      try {
        await AsyncStorage.setItem('@debts', JSON.stringify(debts));
      } catch (error) {
        console.error('Error saving debts:', error);
      }
    };
    if (!loading) {
      saveDebts();
    }
  }, [debts, loading]);

  const addDebt = (title, amount, category) => {
    const newDebt = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      paidAmount: 0,
      category, // Tarjetas, Créditos, Personas, Individuales
      date: new Date().toISOString(),
    };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const updateDebt = (id, updatedFields) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) => (debt.id === id ? { ...debt, ...updatedFields } : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const addPayment = (id, paymentAmount) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) => {
        if (debt.id === id) {
          const newPaidAmount = debt.paidAmount + parseFloat(paymentAmount);
          return { ...debt, paidAmount: newPaidAmount > debt.amount ? debt.amount : newPaidAmount };
        }
        return debt;
      })
    );
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt, addPayment }}>
      {children}
    </DebtContext.Provider>
  );
};
