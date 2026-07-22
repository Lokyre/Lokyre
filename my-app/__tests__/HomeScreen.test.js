import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtProvider } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with no debts', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByText, getByTestId } = render(
      <DebtProvider>
        <HomeScreen navigation={mockNavigation} />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(getByText('No hay deudas registradas.')).toBeTruthy();
      expect(getByText('$0.00')).toBeTruthy(); // Total amount
    });
  });

  it('renders list of debts and calculates total', async () => {
    const mockDebts = [
      { id: '1', title: 'Debt 1', amount: 100, type: 'Tarjeta', isPaid: false },
      { id: '2', title: 'Debt 2', amount: 50.5, type: 'Crédito', isPaid: false },
      { id: '3', title: 'Debt 3', amount: 200, type: 'Persona', isPaid: true }, // should not be included in total
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText, getByTestId } = render(
      <DebtProvider>
        <HomeScreen navigation={mockNavigation} />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(getByText('Debt 1')).toBeTruthy();
      expect(getByText('Debt 2')).toBeTruthy();
      expect(getByText('Debt 3')).toBeTruthy();
      expect(getByText('$150.50')).toBeTruthy(); // 100 + 50.5
    });
  });

  it('navigates to AddDebt screen when FAB is pressed', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByTestId } = render(
      <DebtProvider>
        <HomeScreen navigation={mockNavigation} />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
        expect(getByTestId('fab')).toBeTruthy();
    });

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });
});
