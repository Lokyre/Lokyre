import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Error al cargar las deudas', e);
    } finally {
      setLoading(false);
    }
  };

  const addDebt = async (debtData) => {
    try {
      const newDebt = { ...debtData, id: uuidv4(), createdAt: new Date().toISOString() };
      const updatedDebts = [...debts, newDebt];
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error al guardar la deuda', e);
    }
  };

  const deleteDebt = async (id) => {
    try {
      const updatedDebts = debts.filter((debt) => debt.id !== id);
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error al eliminar la deuda', e);
    }
  };

  const updateDebt = async (id, updatedData) => {
    try {
      const updatedDebts = debts.map((debt) => (debt.id === id ? { ...debt, ...updatedData } : debt));
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error al actualizar la deuda', e);
    }
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, deleteDebt, updateDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
