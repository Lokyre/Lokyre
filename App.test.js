import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

describe('App Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and handles adding a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId, getByText, queryByText, getAllByText, queryAllByText } = render(<App />);

    // Wait for the context to finish loading
    await waitFor(() => {
      expect(getByText('Total Deuda')).toBeTruthy();
    });

    // Go to add debt screen
    fireEvent.press(getByTestId('fab-add'));

    // Fill form
    fireEvent.changeText(getByTestId('input-title'), 'Nueva Deuda');
    fireEvent.changeText(getByTestId('input-amount'), '150');
    fireEvent.press(getByTestId('save-button'));

    // Wait to return to Home and see new total
    await waitFor(() => {
      expect(getAllByText('$150.00')[0]).toBeTruthy();
    });
  });

  it('handles debt deletion', async () => {
    const mockDebts = [{ id: '123', title: 'Deuda A Borrar', amount: 200, type: 'Tarjeta' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    // Mock Alert.alert
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Simulate clicking "Eliminar" (destructive button)
      const deleteButton = buttons.find(b => b.style === 'destructive');
      if (deleteButton) deleteButton.onPress();
    });

    const { getByTestId, getByText, queryByText, getAllByText, queryAllByText } = render(<App />);

    await waitFor(() => {
      expect(getAllByText('$200.00')[0]).toBeTruthy();
    });

    // Delete debt
    fireEvent.press(getByTestId('delete-123'));

    await waitFor(() => {
      expect(queryAllByText('$200.00').length > 0 ? queryAllByText('$200.00')[0] : null).toBeNull();
      expect(getAllByText('$0.00')[0]).toBeTruthy();
    });

    Alert.alert.mockRestore();
  });
});
