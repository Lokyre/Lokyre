import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithProviders = (contextValue) => {
    return render(
      <PaperProvider>
        <NavigationContainer>
          <DebtContext.Provider value={contextValue}>
            <HomeScreen />
          </DebtContext.Provider>
        </NavigationContainer>
      </PaperProvider>
    );
  };

  it('renders loading state correctly', () => {
    const { UNSAFE_getByType } = renderWithProviders({ debts: [], loading: true });

    // Check if ActivityIndicator is rendered using UNSAFE_getByType as per memory instructions
    const activityIndicator = UNSAFE_getByType(ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
  });

  it('renders empty state correctly', () => {
    const { getByText } = renderWithProviders({ debts: [], loading: false });

    expect(getByText('No tienes deudas registradas.')).toBeTruthy();
  });

  it('renders list of debts', () => {
    const mockDebts = [
      { id: '1', title: 'Debt 1', amount: 100, type: 'Tarjeta', dueDate: '2025-01-01', description: '', isPaid: false },
      { id: '2', title: 'Debt 2', amount: 200, type: 'Persona', dueDate: '2025-02-01', description: '', isPaid: true },
    ];

    const { getByText } = renderWithProviders({ debts: mockDebts, loading: false });

    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
    expect(getByText('Monto: $100')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen when FAB is pressed', () => {
    const { getByTestId } = renderWithProviders({ debts: [], loading: false });

    const fab = getByTestId('fab');
    fireEvent.press(fab);

    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt');
  });
});
