import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { PaperProvider } from 'react-native-paper';

describe('HomeScreen', () => {
  it('renders a list of debts and calculates total pending correctly', async () => {
    const mockContext = {
      debts: [
        { id: '1', title: 'Debt 1', amount: '100', isPaid: false, type: 'Tarjeta' },
        { id: '2', title: 'Debt 2', amount: '50', isPaid: true, type: 'Crédito' },
      ],
      loading: false,
    };

    const mockNavigation = { navigate: jest.fn() };

    const { getByText, getByTestId, getAllByText } = render(
      <PaperProvider>
        <DebtContext.Provider value={mockContext}>
          <HomeScreen navigation={mockNavigation} />
        </DebtContext.Provider>
      </PaperProvider>
    );

    // Verify header calculation
    const amounts = getAllByText('$100.00');
    expect(amounts.length).toBeGreaterThan(0);

    // Verify list rendering
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();

    // Verify Navigation on FAB press
    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });

  it('navigates to details when clicking a debt', async () => {
    const mockContext = {
      debts: [
        { id: '1', title: 'Debt 1', amount: '100', isPaid: false, type: 'Tarjeta' },
      ],
      loading: false,
    };

    const mockNavigation = { navigate: jest.fn() };

    const { getByText } = render(
      <PaperProvider>
        <DebtContext.Provider value={mockContext}>
          <HomeScreen navigation={mockNavigation} />
        </DebtContext.Provider>
      </PaperProvider>
    );

    fireEvent.press(getByText('Debt 1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { debtId: '1' });
  });
});
