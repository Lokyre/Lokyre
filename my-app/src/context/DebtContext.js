import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

const initialState = {
  debts: [],
};

const debtReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DEBTS':
      return { ...state, debts: action.payload };
    case 'ADD_DEBT':
      return { ...state, debts: [...state.debts, action.payload] };
    case 'EDIT_DEBT':
      return {
        ...state,
        debts: state.debts.map((debt) =>
          debt.id === action.payload.id ? action.payload : debt
        ),
      };
    case 'DELETE_DEBT':
      return {
        ...state,
        debts: state.debts.filter((debt) => debt.id !== action.payload),
      };
    case 'MARK_PAID':
      return {
        ...state,
        debts: state.debts.map((debt) =>
          debt.id === action.payload ? { ...debt, isPaid: true } : debt
        ),
      };
    default:
      return state;
  }
};

export const DebtProvider = ({ children }) => {
  const [state, dispatch] = useReducer(debtReducer, initialState);

  useEffect(() => {
    const loadDebts = async () => {
      try {
        const storedDebts = await AsyncStorage.getItem('debts');
        if (storedDebts !== null && storedDebts !== undefined) {
          dispatch({ type: 'SET_DEBTS', payload: JSON.parse(storedDebts) });
        }
      } catch (error) {
        console.error('Failed to load debts:', error);
      }
    };
    loadDebts();
  }, []);

  const saveDebts = async (debts) => {
    try {
      await AsyncStorage.setItem('debts', JSON.stringify(debts));
    } catch (error) {
      console.error('Failed to save debts:', error);
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = { ...debtData, id: uuidv4(), isPaid: false };
    const updatedDebts = [...state.debts, newDebt];
    dispatch({ type: 'ADD_DEBT', payload: newDebt });
    await saveDebts(updatedDebts);
  };

  const editDebt = async (debt) => {
    const updatedDebts = state.debts.map((d) => (d.id === debt.id ? debt : d));
    dispatch({ type: 'EDIT_DEBT', payload: debt });
    await saveDebts(updatedDebts);
  };

  const deleteDebt = async (id) => {
    const updatedDebts = state.debts.filter((d) => d.id !== id);
    dispatch({ type: 'DELETE_DEBT', payload: id });
    await saveDebts(updatedDebts);
  };

  const markPaid = async (id) => {
    const updatedDebts = state.debts.map((d) =>
      d.id === id ? { ...d, isPaid: true } : d
    );
    dispatch({ type: 'MARK_PAID', payload: id });
    await saveDebts(updatedDebts);
  };

  return (
    <DebtContext.Provider
      value={{
        debts: state.debts,
        addDebt,
        editDebt,
        deleteDebt,
        markPaid,
      }}
    >
      {children}
    </DebtContext.Provider>
  );
};
