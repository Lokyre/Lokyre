import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtContext } from '../../context/DebtContext';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }) => {
        const { View } = require('react-native');
        return <View>{children}</View>;
    },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }) }
}));


const mockNavigation = { navigate: jest.fn() };

const renderWithProviders = (component, providerValue) => {
    return render(
        <SafeAreaProvider>
            <PaperProvider>
                <DebtContext.Provider value={providerValue}>
                    {component}
                </DebtContext.Provider>
            </PaperProvider>
        </SafeAreaProvider>
    );
};

describe('HomeScreen', () => {
    it('renders loading state initially', () => {
        const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />, {
            debts: [],
            isLoaded: false
        });
        expect(getByText('Cargando deudas...')).toBeTruthy();
    });

    it('renders empty list message', () => {
        const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />, {
            debts: [],
            isLoaded: true
        });
        expect(getByText('Total Pendiente')).toBeTruthy();
        expect(getByText('No hay deudas registradas.')).toBeTruthy();
    });

    it('renders debts and calculates total', () => {
        const mockDebts = [
            { id: '1', name: 'Test 1', amount: 100, isPaid: false, type: 'Personas', createdAt: new Date().toISOString() },
            { id: '2', name: 'Test 2', amount: 50, isPaid: true, type: 'Tarjetas', createdAt: new Date().toISOString() }
        ];

        const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />, {
            debts: mockDebts,
            isLoaded: true
        });

        // Only unpaid debts should contribute to total (100)
        expect(getByText('$100.00')).toBeTruthy();
        expect(getByText('Test 1')).toBeTruthy();
        expect(getByText('Test 2')).toBeTruthy();
    });
});