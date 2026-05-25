import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Error cargando deudas:', e);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
    } catch (e) {
      console.error('Error guardando deudas:', e);
    }
  };

  const addDebt = async (debt) => {
    const newDebt = { ...debt, id: uuidv4() };
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  const removeDebt = async (id) => {
    const newDebts = debts.filter((debt) => debt.id !== id);
    setDebts(newDebts);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, removeDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
