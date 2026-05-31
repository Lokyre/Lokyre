import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

describe('HomeScreen', () => {
  const mockNavigation = { navigate: jest.fn() };

  it('renders correctly with no debts', () => {
    const { getByText, getByTestId } = render(
      <DebtContext.Provider value={{ debts: [] }}>
        <PaperProvider>
          <HomeScreen navigation={mockNavigation} />
        </PaperProvider>
      </DebtContext.Provider>
    );

    expect(getByText('No tienes deudas registradas.')).toBeTruthy();
    expect(getByText('Total Deuda Pendiente')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });

  it('navigates to AddDebt on FAB press', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [] }}>
        <PaperProvider>
          <HomeScreen navigation={mockNavigation} />
        </PaperProvider>
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });

  it('renders debt list correctly', () => {
    const mockDebts = [
      { id: '1', title: 'Tarjeta Visa', amount: 150.50, type: 'Tarjeta', dueDate: '2023-12-01', isPaid: false },
      { id: '2', title: 'Prestamo Auto', amount: 500, type: 'Crédito', dueDate: '2023-12-15', isPaid: true }
    ];

    const { getByText, getAllByText } = render(
      <DebtContext.Provider value={{ debts: mockDebts }}>
        <PaperProvider>
          <HomeScreen navigation={mockNavigation} />
        </PaperProvider>
      </DebtContext.Provider>
    );

    expect(getByText('Tarjeta Visa')).toBeTruthy();
    expect(getByText('Prestamo Auto')).toBeTruthy();
    // Use getAllByText because the amount is rendered in the list and the total pending summary
    expect(getAllByText('$150.50').length).toBe(2);
  });
});
