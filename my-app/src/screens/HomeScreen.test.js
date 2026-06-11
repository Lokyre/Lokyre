import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtProvider } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderScreen = () => {
    const mockNavigation = { navigate: jest.fn() };
    const utils = render(
      <PaperProvider>
        <DebtProvider>
          <HomeScreen navigation={mockNavigation} />
        </DebtProvider>
      </PaperProvider>
    );
    return { ...utils, mockNavigation };
  };

  it('shows loading indicator initially', async () => {
    const { UNSAFE_getByType } = renderScreen();
    // Assuming the only ActivityIndicator rendered is the one for loading
    const loader = UNSAFE_getByType(require('react-native-paper').ActivityIndicator);
    expect(loader).toBeTruthy();

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('renders correctly when there are no debts', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByText } = renderScreen();

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('No hay deudas registradas.')).toBeTruthy();
    expect(getByText('Total Pendiente:')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });

  it('renders a list of debts and calculates total correctly', async () => {
    const mockDebts = [
      { id: '1', title: 'Car Loan', amount: 500, type: 'Crédito', isPaid: false },
      { id: '2', title: 'Lunch', amount: 20, type: 'Persona', isPaid: true },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText, queryByText } = renderScreen();

    await act(async () => {
      await Promise.resolve();
    });

    // Check individual debts
    expect(getByText('Car Loan')).toBeTruthy();
    expect(getByText('Lunch')).toBeTruthy();

    // Check the summary calculation (only pending debt is $500)
    expect(getByText('$500.00')).toBeTruthy();
  });

  it('navigates to AddEditDebt on FAB press', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByTestId, mockNavigation } = renderScreen();

    await act(async () => {
      await Promise.resolve();
    });

    const fab = getByTestId('fab');
    fireEvent.press(fab);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });

  it('navigates to DebtDetail when a debt is pressed', async () => {
    const mockDebts = [
      { id: '1', title: 'Car Loan', amount: 500, type: 'Crédito', isPaid: false },
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));
    const { getByTestId, mockNavigation } = renderScreen();

    await act(async () => {
      await Promise.resolve();
    });

    const card = getByTestId('debt-card-1');
    fireEvent.press(card);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { id: '1' });
  });
});
