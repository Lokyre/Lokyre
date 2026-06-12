import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const addDebt = async (debtData) => {
    try {
      const newDebt = {
        id: uuidv4(),
        ...debtData,
        isPaid: false,
      };
      const updatedDebts = [...debts, newDebt];
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error al guardar deuda', e);
    }
  };

  const toggleDebtPaid = async (id) => {
    try {
      const updatedDebts = debts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
      );
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error al actualizar deuda', e);
    }
  };

  const deleteDebt = async (id) => {
    try {
      const updatedDebts = debts.filter((debt) => debt.id !== id);
      setDebts(updatedDebts);
      await AsyncStorage.setItem('@debts', JSON.stringify(updatedDebts));
    } catch (e) {
      console.error('Error al borrar deuda', e);
    }
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        loading,
        addDebt,
        toggleDebtPaid,
        deleteDebt,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
