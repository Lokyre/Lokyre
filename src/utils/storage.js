import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const DEBTS_STORAGE_KEY = '@debts';

export const getDebts = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(DEBTS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading debts', e);
    return [];
  }
};

export const saveDebts = async (debts) => {
  try {
    const jsonValue = JSON.stringify(debts);
    await AsyncStorage.setItem(DEBTS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving debts', e);
  }
};

export const addDebt = async (debtData) => {
  const currentDebts = await getDebts();
  const newDebt = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...debtData
  };
  const updatedDebts = [...currentDebts, newDebt];
  await saveDebts(updatedDebts);
  return newDebt;
};

export const updateDebt = async (id, updates) => {
  const currentDebts = await getDebts();
  const updatedDebts = currentDebts.map(debt =>
    debt.id === id ? { ...debt, ...updates } : debt
  );
  await saveDebts(updatedDebts);
};

export const deleteDebt = async (id) => {
  const currentDebts = await getDebts();
  const updatedDebts = currentDebts.filter(debt => debt.id !== id);
  await saveDebts(updatedDebts);
};
