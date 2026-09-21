import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtDetailScreen from '../DebtDetailScreen';
import { DebtContext } from '../../context/DebtContext';
import { PaperProvider } from 'react-native-paper';

describe('DebtDetailScreen', () => {
    const mockToggleStatus = jest.fn();
    const mockDeleteDebt = jest.fn();
    const mockNavigation = { goBack: jest.fn() };

    const mockDebt = {
        id: '123',
        name: 'Test Details',
        amount: 250,
        description: 'Details desc',
        type: 'Créditos',
        isPaid: false,
        createdAt: new Date('2023-01-01').toISOString()
    };

    beforeEach(() => {
        mockToggleStatus.mockClear();
        mockDeleteDebt.mockClear();
        mockNavigation.goBack.mockClear();
    });

    const renderWithContext = (debtId) => render(
        <PaperProvider>
            <DebtContext.Provider value={{
                debts: [mockDebt],
                togglePaidStatus: mockToggleStatus,
                deleteDebt: mockDeleteDebt
            }}>
                <DebtDetailScreen route={{ params: { debtId } }} navigation={mockNavigation} />
            </DebtContext.Provider>
        </PaperProvider>
    );

    it('shows not found message if debt missing', () => {
        const { getByText } = renderWithContext('invalid-id');
        expect(getByText('Deuda no encontrada.')).toBeTruthy();
    });

    it('renders debt details correctly', () => {
        const { getByText } = renderWithContext('123');
        expect(getByText('Test Details')).toBeTruthy();
        expect(getByText('$250.00')).toBeTruthy();
        expect(getByText('Créditos')).toBeTruthy();
        expect(getByText('Pendiente')).toBeTruthy();
        expect(getByText('Details desc')).toBeTruthy();
    });

    it('calls togglePaidStatus when button pressed', () => {
        const { getByTestId } = renderWithContext('123');
        fireEvent.press(getByTestId('btn-toggle-status'));
        expect(mockToggleStatus).toHaveBeenCalledWith('123');
    });

    it('calls deleteDebt and navigates back when delete pressed', () => {
        const { getByTestId } = renderWithContext('123');
        fireEvent.press(getByTestId('btn-delete'));
        expect(mockDeleteDebt).toHaveBeenCalledWith('123');
        expect(mockNavigation.goBack).toHaveBeenCalled();
    });
});