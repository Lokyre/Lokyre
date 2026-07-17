import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtContext } from '../../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';

const mockNavigate = jest.fn();

const renderWithContext = (debts, isLoading, mockDelete = jest.fn(), mockToggle = jest.fn()) => {
  return render(
    <NavigationContainer>
      <DebtContext.Provider value={{ debts, isLoading, deleteDebt: mockDelete, toggleDebtStatus: mockToggle }}>
        <HomeScreen navigation={{ navigate: mockNavigate }} />
      </DebtContext.Provider>
    </NavigationContainer>
  );
};

describe('HomeScreen', () => {
  it('shows loading indicator when isLoading is true', async () => {
    const component = renderWithContext([], true);
    await act(async () => { await Promise.resolve(); });

    // Check for ActivityIndicator
    const { UNSAFE_getByType } = component;
    const ActivityIndicator = require('react-native-paper').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders a list of debts and calculates total pending amount', async () => {
    const mockDebts = [
      { id: '1', title: 'Car Loan', amount: '500', type: 'Crédito', isPaid: false },
      { id: '2', title: 'Dinner', amount: '50', type: 'Personal', isPaid: true },
    ];

    const component = renderWithContext(mockDebts, false);
    await act(async () => { await Promise.resolve(); });

    const { getByText, getByTestId } = component;

    // Total pending should be $500.00 since only Car Loan is pending
    expect(getByText('$500.00')).toBeTruthy();
    expect(getByText('Car Loan')).toBeTruthy();
    expect(getByText('Dinner')).toBeTruthy();

    // Check if FAB is present
    expect(getByTestId('fab')).toBeTruthy();
  });

  it('navigates to AddDebt screen when FAB is pressed', async () => {
    const component = renderWithContext([], false);
    await act(async () => { await Promise.resolve(); });

    const { getByTestId } = component;
    const fab = getByTestId('fab');

    fireEvent.press(fab);
    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });
});
