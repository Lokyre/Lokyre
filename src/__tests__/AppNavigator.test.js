import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from '../navigation/AppNavigator';
import { DebtProvider } from '../context/DebtContext';

describe('AppNavigator & Screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders HomeScreen initially with empty state', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByText, getByTestId } = render(
      <DebtProvider>
        <AppNavigator />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByText('No hay deudas registradas.')).toBeTruthy();
      expect(getByText('Total Pendiente')).toBeTruthy();
      expect(getByText('$0.00')).toBeTruthy();
    });
  });

  it('renders HomeScreen with debts', async () => {
    const mockDebts = [
      { id: '1', title: 'Test Card', amount: 150.50, type: 'tarjeta', status: 'pending', createdAt: new Date().toISOString() }
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText, getByTestId } = render(
      <DebtProvider>
        <AppNavigator />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByText('Test Card')).toBeTruthy();
      expect(getByText('$150.50')).toBeTruthy();
    });
  });

  it('navigates to AddDebtScreen on FAB press', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByTestId, getByText } = render(
      <DebtProvider>
        <AppNavigator />
      </DebtProvider>
    );

    await waitFor(() => {
      expect(getByTestId('add-debt-fab')).toBeTruthy();
    });

    fireEvent.press(getByTestId('add-debt-fab'));

    await waitFor(() => {
      expect(getByText('Nueva Deuda')).toBeTruthy();
    });
  });
});
