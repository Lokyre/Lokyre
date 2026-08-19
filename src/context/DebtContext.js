import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    } catch (error) {
      console.error('Failed to load debts', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDebts = async (newDebts) => {
    try {
      await AsyncStorage.setItem('@debts', JSON.stringify(newDebts));
      setDebts(newDebts);
    } catch (error) {
      console.error('Failed to save debts', error);
    }
  };

  const addDebt = async (debt) => {
    const newDebts = [...debts, debt];
    await saveDebts(newDebts);
  };

  const addPayment = async (debtId, payment) => {
    const newDebts = debts.map(debt => {
      if (debt.id === debtId) {
        const newPayments = [...(debt.payments || []), payment];
        const newTotalPaid = (debt.totalPaid || 0) + payment.amount;
        const newStatus = newTotalPaid >= debt.totalAmount ? 'pagado' : 'pendiente';

        return {
          ...debt,
          payments: newPayments,
          totalPaid: newTotalPaid,
          status: newStatus
        };
      }
      return debt;
    });

    await saveDebts(newDebts);
  };

  const deleteDebt = async (debtId) => {
    const newDebts = debts.filter(debt => debt.id !== debtId);
    await saveDebts(newDebts);
  };

  return (
    <DebtContext.Provider value={{ debts, loading, addDebt, addPayment, deleteDebt }}>
      {children}
    </DebtContext.Provider>
  );
};
