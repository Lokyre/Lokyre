import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    // mock unresolved promise
    let resolvePromise;
    const promise = new Promise((resolve) => { resolvePromise = resolve; });
    AsyncStorage.getItem.mockReturnValueOnce(promise);

    const { getByText } = render(<App />);
    expect(getByText('Cargando deudas...')).toBeTruthy();

    resolvePromise(null);
  });

  it('renders empty state when no debts', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('No hay deudas pendientes.')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('navigates to AddDebt and adds a debt', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, getByText, queryByText } = render(<App />);

    // Wait to load
    await waitFor(() => {
      expect(getByText('No hay deudas pendientes.')).toBeTruthy();
    });

    // Navigate to Add
    const fab = getByTestId('add-debt-fab');
    fireEvent.press(fab);

    // Fill form
    await waitFor(() => {
      expect(getByTestId('description-input')).toBeTruthy();
    });

    fireEvent.changeText(getByTestId('description-input'), 'Nueva Deuda Test');
    fireEvent.changeText(getByTestId('amount-input'), '150.50');

    // Choose category
    const radio = getByTestId('radio-creditos');
    fireEvent.press(radio);

    // Save
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Verify it returns to home and shows the new debt
    await waitFor(() => {
      expect(getByText('Nueva Deuda Test')).toBeTruthy();
      expect(getByText('Monto: $150.50')).toBeTruthy();
      expect(getByText('Categoría: Créditos')).toBeTruthy();
      expect(getByText('Total: $150.50')).toBeTruthy();
    });
  });

  it('removes a debt', async () => {
    const mockDebts = [
      { id: '123', description: 'Deuda a borrar', amount: 50, category: 'Personas' }
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText, getByTestId, queryByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Deuda a borrar')).toBeTruthy();
    });

    const removeBtn = getByTestId('remove-123');
    fireEvent.press(removeBtn);

    await waitFor(() => {
      expect(queryByText('Deuda a borrar')).toBeNull();
      expect(getByText('Total: $0.00')).toBeTruthy();
    });
  });
});
