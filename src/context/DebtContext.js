import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DebtContext = createContext();

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
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

  const saveDebts = async (debtsToSave) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(debtsToSave));
    } catch (e) {
      console.error('Failed to save debts.', e);
    }
  };

  const addDebt = (debt) => {
    setDebts((prevDebts) => [...prevDebts, debt]);
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const toggleDebtPayment = (id) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
      )
    );
  };

  const getDebtById = (id) => debts.find((debt) => debt.id === id);

  return (
    <DebtContext.Provider
      value={{
        debts,
        addDebt,
        deleteDebt,
        toggleDebtPayment,
        getDebtById,
        isLoaded,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};

export const useDebts = () => useContext(DebtContext);
