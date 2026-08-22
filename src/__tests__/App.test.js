import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebtProvider } from '../context/DebtContext';
import HomeScreen from '../screens/HomeScreen';
import { PaperProvider } from 'react-native-paper';

describe('App functionality', () => {
  beforeEach(() => {
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('renders HomeScreen with empty state correctly', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByText } = render(
      <PaperProvider>
        <DebtProvider>
          <HomeScreen />
        </DebtProvider>
      </PaperProvider>
    );

    await waitFor(() => {
      expect(getByText('No tienes deudas registradas.')).toBeTruthy();
    });
  });

  it('loads and displays debts from context', async () => {
    const mockDebts = [
      { id: '1', description: 'Test Debt 1', amount: 100, category: 'Personas', dueDate: '10/10/2023', isPaid: false }
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText, getByTestId } = render(
      <PaperProvider>
        <DebtProvider>
          <HomeScreen />
        </DebtProvider>
      </PaperProvider>
    );

    await waitFor(() => {
      expect(getByText('Test Debt 1')).toBeTruthy();
      expect(getByText('$100')).toBeTruthy();
      expect(getByText('Estado: Pendiente')).toBeTruthy();
      expect(getByTestId('debt-card-1')).toBeTruthy();
    });
  });
});
