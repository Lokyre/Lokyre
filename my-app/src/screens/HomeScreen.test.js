import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';

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
  const mockContextValue = {
    debts: [
      { id: '1', title: 'Test Debt 1', amount: 100, type: 'Individual', isPaid: false },
      { id: '2', title: 'Test Debt 2', amount: 50, type: 'Tarjeta', isPaid: true }
    ],
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithContext = (contextValue) => {
    return render(
      <NavigationContainer>
        <DebtContext.Provider value={contextValue}>
          <HomeScreen />
        </DebtContext.Provider>
      </NavigationContainer>
    );
  };

  it('renders correctly with debts', () => {
    const { getByText, getByTestId } = renderWithContext(mockContextValue);

    expect(getByText('Test Debt 1')).toBeTruthy();
    expect(getByText('Test Debt 2')).toBeTruthy();
    expect(getByText('Pendiente')).toBeTruthy();
    expect(getByText('Pagado')).toBeTruthy();
    // Only unpaid debts are summed
    expect(getByText('$100.00')).toBeTruthy();
  });

  it('navigates to AddDebt on FAB press', () => {
    const { getByTestId } = renderWithContext(mockContextValue);

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });

  it('navigates to DebtDetail on card press', () => {
    const { getByTestId } = renderWithContext(mockContextValue);

    fireEvent.press(getByTestId('debt-card-1'));
    expect(mockNavigate).toHaveBeenCalledWith('DebtDetail', { debtId: '1' });
  });

  it('renders empty state when no debts', () => {
    const { getByText } = renderWithContext({ debts: [], loading: false });
    expect(getByText('No tienes deudas registradas.')).toBeTruthy();
  });
});
