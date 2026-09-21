import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DebtContext = createContext();

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
                if (storedDebts) {
                    setDebts(JSON.parse(storedDebts));
                }
            } catch (error) {
                console.error("Failed to load debts from storage", error);
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
                    console.error("Failed to save debts to storage", error);
                }
            }
        };

        saveDebts();
    }, [debts, isLoaded]);

    const addDebt = (debtData) => {
        const newDebt = {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            isPaid: false,
            ...debtData,
        };
        setDebts(prevDebts => [...prevDebts, newDebt]);
    };

    const togglePaidStatus = (id) => {
        setDebts(prevDebts => prevDebts.map(debt =>
            debt.id === id ? { ...debt, isPaid: !debt.isPaid } : debt
        ));
    };

    const deleteDebt = (id) => {
        setDebts(prevDebts => prevDebts.filter(debt => debt.id !== id));
    };

    return (
        <DebtContext.Provider value={{
            debts,
            addDebt,
            togglePaidStatus,
            deleteDebt,
            isLoaded
        }}>
            {children}
        </DebtContext.Provider>
    );
};
