import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/context/DebtContext';

const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  it('renders correctly with no debts', async () => {
    const { getByText, getByTestId } = render(
      <DebtContext.Provider value={{ debts: [] }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    expect(getByText('No tienes deudas registradas.')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
    expect(getByTestId('fab')).toBeTruthy();
  });

  it('renders debts and calculates total', async () => {
    const mockDebts = [
      { id: '1', title: 'Debt 1', amount: 100, isPaid: false, type: 'Tarjeta', dueDate: '10/10/2023' },
      { id: '2', title: 'Debt 2', amount: 50, isPaid: true, type: 'Crédito', dueDate: '11/10/2023' },
    ];

    const { getByText, getAllByText } = render(
      <DebtContext.Provider value={{ debts: mockDebts }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
    // Only pending debts are added to the total
    expect(getAllByText('$100.00')).toBeTruthy();
  });

  it('navigates to DebtForm on FAB press', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [] }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtForm');
  });
});
