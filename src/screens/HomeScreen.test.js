import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtProvider } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigate = jest.fn();

const renderHomeScreen = () => {
  return render(
    <DebtProvider>
      <HomeScreen navigation={{ navigate: mockNavigate }} />
    </DebtProvider>
  );
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders total debt correctly', async () => {
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: '1', name: 'Test', amount: 150, type: 'Individual' }])
    );
    const { findByText } = renderHomeScreen();
    const totalElement = await findByText(/Deuda Total: \$150.00/);
    expect(totalElement).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen on FAB press', async () => {
    AsyncStorage.getItem.mockResolvedValue(null);
    const { findByTestId } = renderHomeScreen();
    const fab = await findByTestId('add-debt-fab');
    fireEvent.press(fab);
    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt');
  });

  it('navigates to edit screen when a card is pressed', async () => {
    AsyncStorage.getItem.mockResolvedValue(
      JSON.stringify([{ id: 'card123', name: 'Test', amount: 100, type: 'Individual' }])
    );
    const { findByTestId } = renderHomeScreen();
    const card = await findByTestId('debt-card-card123');
    fireEvent.press(card);
    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt', { debtId: 'card123' });
  });
});
