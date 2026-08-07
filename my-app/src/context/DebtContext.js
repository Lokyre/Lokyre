import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      const storedDebts = await AsyncStorage.getItem('@debts');
      if (storedDebts !== null && storedDebts !== undefined) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (error) {
      console.error('Error al cargar deudas:', error);
    }
  };

  const addDebt = async (debt) => {
    try {
      const newDebt = { ...debt, id: uuidv4() };
      const updatedDebts = [...debts, newDebt];
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Error al guardar la deuda:', error);
    }
  };

  const updateDebt = async (id, updatedData) => {
    try {
      const updatedDebts = debts.map((d) => (d.id === id ? { ...d, ...updatedData } : d));
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Error al actualizar la deuda:', error);
    }
  };

  const deleteDebt = async (id) => {
    try {
      const updatedDebts = debts.filter((d) => d.id !== id);
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (error) {
      console.error('Error al eliminar la deuda:', error);
    }
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
