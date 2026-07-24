import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtProvider } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';

const mockNavigation = { navigate: jest.fn() };
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => mockNavigation,
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <HomeScreen />
      </DebtProvider>
    );

    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders correctly with no debts', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    const { getByText, queryByTestId } = render(
      <DebtProvider>
        <HomeScreen />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Total Pendiente')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
    expect(getByText('No hay deudas pendientes')).toBeTruthy();
  });

  it('renders list of debts and total correctly', async () => {
    const debts = [
      { id: '1', title: 'Test 1', amount: '100', type: 'Individual', isPaid: false },
      { id: '2', title: 'Test 2', amount: '50', type: 'Tarjeta', isPaid: true },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(debts));

    const { getByText, getByTestId } = render(
      <DebtProvider>
        <HomeScreen />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    // Wait for data to load
    await waitFor(() => {
      expect(getByText('Test 1')).toBeTruthy();
    });

    // Total should only include unpaid (100)
    expect(getByText('$100.00')).toBeTruthy();
    expect(getByText('Test 2')).toBeTruthy();

    // Check navigation
    fireEvent.press(getByTestId('debt-card-1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { id: '1' });

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });
});
