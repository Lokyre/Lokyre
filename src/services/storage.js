import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DEBTS_STORAGE_KEY = '@debts_key';

export const getDebts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch debts from storage', e);
    return [];
  }
};

export const saveDebt = async (debtData) => {
  try {
    const currentDebts = await getDebts();
    const newDebt = { ...debtData, id: uuidv4() };
    const updatedDebts = [...currentDebts, newDebt];
    const jsonValue = JSON.stringify(updatedDebts);
    await AsyncStorage.setItem(DEBTS_STORAGE_KEY, jsonValue);
    return newDebt;
  } catch (e) {
    console.error('Failed to save debt to storage', e);
    throw e;
  }
};

export const updateDebt = async (id, updatedData) => {
  try {
    const currentDebts = await getDebts();
    const updatedDebts = currentDebts.map((debt) =>
      debt.id === id ? { ...debt, ...updatedData } : debt
    );
    const jsonValue = JSON.stringify(updatedDebts);
    await AsyncStorage.setItem(DEBTS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to update debt in storage', e);
    throw e;
  }
};

export const deleteDebt = async (id) => {
  try {
    const currentDebts = await getDebts();
    const updatedDebts = currentDebts.filter((debt) => debt.id !== id);
    const jsonValue = JSON.stringify(updatedDebts);
    await AsyncStorage.setItem(DEBTS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to delete debt from storage', e);
    throw e;
  }
};

export const getDebtById = async (id) => {
  try {
    const currentDebts = await getDebts();
    return currentDebts.find((debt) => debt.id === id);
  } catch (e) {
    console.error('Failed to get debt by id', e);
    return null;
  }
};
