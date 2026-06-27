import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { DebtProvider } from '../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaperProvider } from 'react-native-paper';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with empty debts', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));

    let getByText;
    const { getByText: _getByText } = render(
      <PaperProvider>
        <DebtProvider>
          <HomeScreen navigation={{ navigate: jest.fn() }} />
        </DebtProvider>
      </PaperProvider>
    );
    getByText = _getByText;

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('No hay deudas registradas.')).toBeTruthy();
  });

  it('renders a debt card correctly', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt Title', amount: 500, type: 'Crédito', dueDate: '15/10/2024', isPaid: false }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText } = render(
      <PaperProvider>
        <DebtProvider>
          <HomeScreen navigation={{ navigate: jest.fn() }} />
        </DebtProvider>
      </PaperProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Test Debt Title')).toBeTruthy();
    expect(getByText('Crédito')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen when FAB is pressed', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    const mockNavigate = jest.fn();

    let getByTestId;
    const { getByTestId: _getByTestId } = render(
      <PaperProvider>
        <DebtProvider>
          <HomeScreen navigation={{ navigate: mockNavigate }} />
        </DebtProvider>
      </PaperProvider>
    );
    getByTestId = _getByTestId;

    await act(async () => {
      await Promise.resolve();
    });

    const fab = getByTestId('fab');
    fireEvent.press(fab);

    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt');
  });
});
