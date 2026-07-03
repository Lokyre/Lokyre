import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtProvider } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigation = { navigate: jest.fn() };

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    AsyncStorage.getItem.mockReturnValueOnce(new Promise(() => {})); // Hangs loading
    const { UNSAFE_getByType } = render(
      <PaperProvider>
        <DebtProvider>
          <HomeScreen navigation={mockNavigation} />
        </DebtProvider>
      </PaperProvider>
    );

    expect(UNSAFE_getByType(require('react-native-paper').ActivityIndicator)).toBeTruthy();
  });

  it('renders empty state when no debts', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByText } = render(
      <PaperProvider>
        <DebtProvider>
          <HomeScreen navigation={mockNavigation} />
        </DebtProvider>
      </PaperProvider>
    );

    await act(async () => { await Promise.resolve(); });
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
  });

  it('navigates to AddDebt on FAB press', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const { getByTestId } = render(
      <PaperProvider>
        <DebtProvider>
          <HomeScreen navigation={mockNavigation} />
        </DebtProvider>
      </PaperProvider>
    );

    await act(async () => { await Promise.resolve(); });

    await act(async () => {
      fireEvent.press(getByTestId('fab'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });
});
