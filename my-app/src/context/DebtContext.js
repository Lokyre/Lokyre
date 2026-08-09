import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Alert } from 'react-native';

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
      if (storedDebts !== null && storedDebts !== undefined) {
        setDebts(JSON.parse(storedDebts));
      }
    } catch (e) {
      console.error('Error al cargar deudas', e);
      Alert.alert('Error', 'No se pudieron cargar las deudas.');
    }
  };

  const addDebt = async (title, amount, type) => {
    try {
      const newDebt = {
        id: uuidv4(),
        title,
        amount: parseFloat(amount),
        type,
        date: new Date().toISOString(),
      };
      const updatedDebts = [...debts, newDebt];
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error al agregar deuda', e);
      Alert.alert('Error', 'No se pudo agregar la deuda.');
    }
  };

  const deleteDebt = async (id) => {
    try {
      const updatedDebts = debts.filter(debt => debt.id !== id);
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error al eliminar deuda', e);
      Alert.alert('Error', 'No se pudo eliminar la deuda.');
    }
  };

  const updateDebt = async (id, updatedTitle, updatedAmount, updatedType) => {
    try {
      const updatedDebts = debts.map(debt =>
        debt.id === id
          ? { ...debt, title: updatedTitle, amount: parseFloat(updatedAmount), type: updatedType }
          : debt
      );
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error al actualizar deuda', e);
      Alert.alert('Error', 'No se pudo actualizar la deuda.');
    }
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, deleteDebt, updateDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
