import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtContext } from '../../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
    })),
  };
});

const mockNavigate = jest.fn();

describe('HomeScreen', () => {
  beforeEach(() => {
    useNavigation.mockReturnValue({ navigate: mockNavigate });
  });

  it('renders loading state', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [], loading: true }}>
        <HomeScreen />
      </DebtContext.Provider>
    );
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders total and debts correctly', () => {
    const debts = [
      { id: '1', title: 'Debt 1', amount: 100, type: 'Individual', isPaid: false },
      { id: '2', title: 'Debt 2', amount: 50, type: 'Tarjeta', isPaid: true }
    ];

    const { getByText } = render(
      <DebtContext.Provider value={{ debts, loading: false }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    expect(getByText('$100.00')).toBeTruthy(); // Total
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
  });

  it('navigates to Add Debt when FAB is pressed', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [], loading: false }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('fab-add-debt'));
    expect(mockNavigate).toHaveBeenCalledWith('Agregar Deuda');
  });

  it('navigates to details when a debt is pressed', () => {
    const debts = [
      { id: '1', title: 'Debt 1', amount: 100, type: 'Individual', isPaid: false },
    ];

    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts, loading: false }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('debt-card-1'));
    expect(mockNavigate).toHaveBeenCalledWith('Detalles', { debtId: '1' });
  });
});
