import React from 'react';
import { render, act } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/context/DebtContext';

const mockNavigation = { navigate: jest.fn() };

const renderWithContext = (debts, loading = false) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={{ debts, loading }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('HomeScreen', () => {
  it('renders loading state', () => {
    const { UNSAFE_getByType } = renderWithContext([], true);
    expect(UNSAFE_getByType(require('react-native-paper').ActivityIndicator)).toBeTruthy();
  });

  it('renders empty state', () => {
    const { getByText } = renderWithContext([]);
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });

  it('renders list of debts and correct summary', () => {
    const mockDebts = [
      { id: '1', title: 'Debt 1', amount: 100, type: 'Tarjeta', isPaid: false },
      { id: '2', title: 'Debt 2', amount: 50, type: 'Crédito', isPaid: true },
    ];

    const { getByText, getAllByText } = renderWithContext(mockDebts);

    expect(getByText('$100.00')).toBeTruthy(); // Only unpaid amounts are summed

    // Instead of querying by testID (which fails due to mocking structure), query by text which we know exists and is visible (or technically in our rendered output string).
    expect(getAllByText('Debt 1').length).toBeGreaterThan(0);
    expect(getAllByText('$100.00 - Tarjeta').length).toBeGreaterThan(0);
  });
});
