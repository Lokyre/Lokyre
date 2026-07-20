import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/DebtContext';

const mockNavigate = jest.fn();

const renderWithContext = (component, contextValue) => {
  return render(
    <DebtContext.Provider value={contextValue}>
      {component}
    </DebtContext.Provider>
  );
};

describe('HomeScreen', () => {
  it('renders loading state when not loaded', () => {
    const { UNSAFE_getByType } = renderWithContext(
      <HomeScreen navigation={{ navigate: mockNavigate }} />,
      { isLoaded: false, debts: [] }
    );
    expect(UNSAFE_getByType(require('react-native-paper').ActivityIndicator)).toBeTruthy();
  });

  it('renders total pending and list of debts', () => {
    const mockDebts = [
      { id: '1', title: 'Rent', amount: 500, type: 'Individual', isPaid: false },
      { id: '2', title: 'Car', amount: 200, type: 'Crédito', isPaid: true },
    ];

    const { getByTestId, getByText } = renderWithContext(
      <HomeScreen navigation={{ navigate: mockNavigate }} />,
      { isLoaded: true, debts: mockDebts, toggleDebtPaid: jest.fn(), deleteDebt: jest.fn() }
    );

    expect(getByTestId('total-pending').children.join('')).toContain('500.00');
    expect(getByText('Rent')).toBeTruthy();
    expect(getByText('Car')).toBeTruthy();
  });

  it('navigates to AddDebt on FAB press', () => {
    const { getByTestId } = renderWithContext(
      <HomeScreen navigation={{ navigate: mockNavigate }} />,
      { isLoaded: true, debts: [] }
    );

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });
});
