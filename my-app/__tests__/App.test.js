import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtProvider } from '../src/context/DebtContext';
import HomeScreen from '../src/screens/HomeScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() })
}));

describe('App Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows empty state when there are no debts', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <PaperProvider>
          <HomeScreen navigation={{ navigate: jest.fn() }} />
        </PaperProvider>
      </DebtProvider>
    );

    // wait for async effect in DebtProvider
    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
    });

    expect(getByTestId('empty-message')).toBeTruthy();
    expect(getByTestId('total-debt').props.children).toEqual(['$', '0.00']);
  });

  it('renders a list of debts and calculates total', async () => {
    const mockDebts = [
      { id: '1', title: 'Test Debt 1', amount: 150.5, type: 'Tarjeta', isPaid: false },
      { id: '2', title: 'Test Debt 2', amount: 50.0, type: 'Persona', isPaid: true }
    ];

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, queryByTestId } = render(
      <DebtProvider>
        <PaperProvider>
          <HomeScreen navigation={{ navigate: jest.fn() }} />
        </PaperProvider>
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(queryByTestId('loading-indicator')).toBeNull();
    });

    expect(getByTestId('total-debt').props.children).toEqual(['$', '150.50']);
    expect(getByTestId('debt-title-1')).toBeTruthy();
    expect(getByTestId('debt-title-2')).toBeTruthy();
  });
});
