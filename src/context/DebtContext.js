import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DebtContext = createContext();

export const useDebts = () => useContext(DebtContext);

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts_list');
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
    const saveDebts = async () => {
      if (!isLoaded) return;
      try {
        await AsyncStorage.setItem('@debts_list', JSON.stringify(debts));
      } catch (error) {
        console.error('Error saving debts:', error);
      }
    };

    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debt) => {
    setDebts((prevDebts) => [...prevDebts, debt]);
  };

  const updateDebt = (updatedDebt) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const toggleDebtStatus = (id) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) =>
        debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
      )
    );
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        isLoaded,
        addDebt,
        updateDebt,
        deleteDebt,
        toggleDebtStatus,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
