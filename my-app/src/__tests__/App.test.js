import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mock Alert to prevent hanging
jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
    // Automatically trigger the "Eliminar" or confirm action if it exists
    if (buttons && buttons.length > 1) {
       buttons[1].onPress();
    }
});

describe('Debt Management App', () => {
    beforeEach(async () => {
        await AsyncStorage.clear();
        jest.clearAllMocks();
    });

    it('should add a new debt, view its details, and mark it as paid', async () => {
        const { getByText, getAllByText, getByTestId, queryByText, queryByTestId, UNSAFE_getByType } = render(<App />);

        // Wait for initial load
        await waitFor(() => {
            expect(getByText('Total Pendiente')).toBeTruthy();
        });

        // Tap FAB to add
        fireEvent.press(getByTestId('fab-add-debt'));

        // Wait for Add Screen
        await waitFor(() => {
            expect(getAllByText('Título de la deuda')[0]).toBeTruthy();
        });

        // Fill form
        fireEvent.changeText(getByTestId('input-title'), 'Tarjeta de Crédito');
        fireEvent.changeText(getByTestId('input-amount'), '1500');
        fireEvent.press(getByTestId('radio-Tarjetas'));

        // Save
        fireEvent.press(getByTestId('btn-save'));

        // Wait for return to Home and verify item exists
        await waitFor(() => {
            expect(getByText('Tarjeta de Crédito')).toBeTruthy();
            expect(getByText('Monto: $1500')).toBeTruthy();
            expect(getByText('$1500.00')).toBeTruthy(); // Total debt
        });

        // Tap on the card to see details
        const cards = queryByText('Tarjeta de Crédito');
        expect(cards).toBeTruthy();

        // Use a regexp for the dynamic test ID if needed, but since we know it's the first one, let's tap it via text wrapper (if it is a Card.Title mock, we need to click the Card mock)
        // Since we mocked Card, we can search for the Text and click its parent, or find by testID directly

        // Since id is dynamic (UUID), we can't hardcode testID. We will press the element that contains the title.
        fireEvent.press(getByText('Tarjeta de Crédito'));

        // Wait for Detail screen
        await waitFor(() => {
            expect(getByText('Detalles de la Deuda')).toBeTruthy();
            expect(getByText('Pendiente')).toBeTruthy();
        });

        // Mark as paid
        fireEvent.press(getByTestId('btn-toggle-status'));

        // Wait for return to Home
        await waitFor(() => {
            expect(getByText('Total Pendiente')).toBeTruthy();
        });

        // Verify total debt is now 0 since it's paid
        expect(getByText('$0.00')).toBeTruthy();

        // Since it is paid, it should not be in the pending list
        expect(queryByText('Tarjeta de Crédito')).toBeNull();
    });
});
