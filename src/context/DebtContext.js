import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const debtReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DEBTS':
      return action.payload;
    case 'ADD_DEBT':
      return [...state, action.payload];
    case 'UPDATE_DEBT':
      return state.map((debt) => (debt.id === action.payload.id ? action.payload : debt));
    case 'DELETE_DEBT':
      return state.filter((debt) => debt.id !== action.payload);
    case 'MARK_AS_PAID':
      return state.map((debt) =>
        debt.id === action.payload ? { ...debt, isPaid: !debt.isPaid } : debt
      );
    default:
      return state;
  }
};

export const DebtProvider = ({ children }) => {
  const [debts, dispatch] = useReducer(debtReducer, []);
  const [isLoaded, setIsLoaded] = React.useState(false);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('debts');
        if (storedDebts) {
          dispatch({ type: 'LOAD_DEBTS', payload: JSON.parse(storedDebts) });
        }
      } catch (error) {
        console.error('Failed to load debts from AsyncStorage', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadDebts();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const saveDebts = async () => {
      try {
        await AsyncStorage.setItem('debts', JSON.stringify(debts));
      } catch (error) {
        console.error('Failed to save debts to AsyncStorage', error);
      }
    };
    saveDebts();
  }, [debts, isLoaded]);

  const addDebt = (debtData) => {
    const newDebt = { ...debtData, id: uuidv4(), isPaid: false };
    dispatch({ type: 'ADD_DEBT', payload: newDebt });
  };

  const updateDebt = (updatedDebt) => {
    dispatch({ type: 'UPDATE_DEBT', payload: updatedDebt });
  };

  const deleteDebt = (id) => {
    dispatch({ type: 'DELETE_DEBT', payload: id });
  };

  const togglePaidStatus = (id) => {
    dispatch({ type: 'MARK_AS_PAID', payload: id });
  };

  return (
    <DebtContext.Provider value={{ debts, addDebt, updateDebt, deleteDebt, togglePaidStatus }}>
      {children}
    </DebtContext.Provider>
  );
};
