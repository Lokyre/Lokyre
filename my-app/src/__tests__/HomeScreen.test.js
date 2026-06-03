import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

describe('HomeScreen', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when loading', () => {
    const { UNSAFE_getByType } = renderWithContext([], true);
    const ActivityIndicator = require('react-native-paper').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('displays empty state when no debts', () => {
    const { getByText } = renderWithContext([]);
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
    expect(getByText('Total Pendiente: $0.00')).toBeTruthy();
  });

  it('displays a list of debts and calculates total unpaid amount', () => {
    const debts = [
      { id: '1', title: 'Debt 1', amount: 100, type: 'Tarjeta', dueDate: '01/01/25', isPaid: false },
      { id: '2', title: 'Debt 2', amount: 50, type: 'Persona', dueDate: '02/02/25', isPaid: true },
    ];

    const { getByText } = renderWithContext(debts);

    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
    expect(getByText('Total Pendiente: $100.00')).toBeTruthy(); // Only unpaid
  });

  it('navigates to AddEditDebt when FAB is pressed', () => {
    const { getByTestId } = renderWithContext([]);
    const fab = getByTestId('fab');
    fireEvent.press(fab);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });

  it('navigates to DebtDetail when a debt is pressed', () => {
    const debts = [
      { id: '1', title: 'Debt 1', amount: 100, type: 'Tarjeta', dueDate: '01/01/25', isPaid: false },
    ];
    const { getByText } = renderWithContext(debts);

    fireEvent.press(getByText('Debt 1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { debtId: '1' });
  });
});
