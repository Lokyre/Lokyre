import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DebtContext = createContext();

export const useDebts = () => {
  return useContext(DebtContext);
};

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('@debts');
        if (storedDebts !== null) {
          setDebts(JSON.parse(storedDebts));
        }
      } catch (error) {
        console.error('Error loading debts from AsyncStorage', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadDebts();
  }, []);

  useEffect(() => {
    const saveDebts = async () => {
      if (isLoaded) {
        try {
          await AsyncStorage.setItem('@debts', JSON.stringify(debts));
        } catch (error) {
          console.error('Error saving debts to AsyncStorage', error);
        }
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debtData) => {
    const newDebt = {
      ...debtData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      isPaid: false,
    };
    setDebts((prevDebts) => [...prevDebts, newDebt]);
  };

  const updateDebt = (id, updatedData) => {
    setDebts((prevDebts) =>
      prevDebts.map((debt) => (debt.id === id ? { ...debt, ...updatedData } : debt))
    );
  };

  const deleteDebt = (id) => {
    setDebts((prevDebts) => prevDebts.filter((debt) => debt.id !== id));
  };

  const payDebt = (id) => {
    updateDebt(id, { isPaid: true });
  };

  return (
    <DebtContext.Provider
      value={{
        debts,
        isLoaded,
        addDebt,
        updateDebt,
        deleteDebt,
        payDebt,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
