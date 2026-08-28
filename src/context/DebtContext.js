import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load debts on initial mount
  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
        if (storedDebts !== null) {
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

  // Save debts whenever they change
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

  const addDebt = (debt) => {
    const newDebt = {
      ...debt,
      id: uuidv4(),
      status: 'Pendiente', // Pendiente, Pagado
      createdAt: new Date().toISOString(),
    };
    setDebts([...debts, newDebt]);
  };

  const updateDebt = (id, updatedFields) => {
    setDebts(debts.map(debt => debt.id === id ? { ...debt, ...updatedFields } : debt));
  };

  const deleteDebt = (id) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const markAsPaid = (id) => {
    updateDebt(id, { status: 'Pagado' });
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, updateDebt, deleteDebt, markAsPaid }}>
      {children}
    </DebtContext.Provider>
  );
};

export const useDebtContext = () => useContext(DebtContext);
