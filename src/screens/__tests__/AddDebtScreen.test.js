import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddDebtScreen from '../AddDebtScreen';
import { DebtContext } from '../../context/DebtContext';
import { PaperProvider } from 'react-native-paper';

jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => 'TouchableOpacity');

describe('AddDebtScreen', () => {
    const mockAddDebt = jest.fn();
    const mockNavigation = { goBack: jest.fn() };

    beforeEach(() => {
        mockAddDebt.mockClear();
        mockNavigation.goBack.mockClear();
        globalThis.alert = jest.fn();
    });

    afterEach(() => {
        delete globalThis.alert;
    });

    const renderWithContext = () => render(
        <PaperProvider>
            <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
                <AddDebtScreen navigation={mockNavigation} />
            </DebtContext.Provider>
        </PaperProvider>
    );

    it('shows error if name or amount are empty', () => {
        const { getByTestId } = renderWithContext();

        fireEvent.press(getByTestId('btn-save'));

        expect(globalThis.alert).toHaveBeenCalledWith('Error: Por favor ingresa el nombre y el monto.');
        expect(mockAddDebt).not.toHaveBeenCalled();
    });

    it('shows error if amount is invalid', () => {
        const { getByTestId } = renderWithContext();

        fireEvent.changeText(getByTestId('input-name'), 'Test Debt');
        fireEvent.changeText(getByTestId('input-amount'), '-50');
        fireEvent.press(getByTestId('btn-save'));

        expect(globalThis.alert).toHaveBeenCalledWith('Error: Ingresa un monto válido.');
        expect(mockAddDebt).not.toHaveBeenCalled();
    });

    it('adds debt and navigates back on valid submit', () => {
        const { getByTestId } = renderWithContext();

        fireEvent.changeText(getByTestId('input-name'), 'Valid Debt');
        fireEvent.changeText(getByTestId('input-amount'), '150.50');
        fireEvent.changeText(getByTestId('input-description'), 'Test description');

        fireEvent.press(getByTestId('btn-save'));

        expect(mockAddDebt).toHaveBeenCalledWith({
            name: 'Valid Debt',
            amount: 150.5,
            description: 'Test description',
            type: 'Tarjetas'
        });
        expect(mockNavigation.goBack).toHaveBeenCalled();
    });
});