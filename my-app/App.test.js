import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './App';

describe('Debt App Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Home screen with empty state', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByText } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(getByText('No hay deudas registradas.')).toBeTruthy();
    });
  });

  it('can navigate to add debt screen and add a new debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByText, getByTestId } = render(<App />);

    await act(async () => {
      await Promise.resolve();
    });

    // Navigate
    const fab = getByTestId('fab');
    await act(async () => {
      fireEvent.press(fab);
    });

    await waitFor(() => {
      expect(getByText('Guardar Deuda')).toBeTruthy();
    });

    // Fill form
    const titleInput = getByTestId('input-title');
    const amountInput = getByTestId('input-amount');

    await act(async () => {
      fireEvent.changeText(titleInput, 'Test Debt');
      fireEvent.changeText(amountInput, '100');
    });

    // Save
    const saveButton = getByText('Guardar Deuda');
    await act(async () => {
      fireEvent.press(saveButton);
    });

    // Check if it's saved in AsyncStorage and we are back to Home with the item
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    await waitFor(() => {
      expect(getByText('Test Debt')).toBeTruthy();
      expect(getByText('Monto: $100')).toBeTruthy();
    });
  });
});
