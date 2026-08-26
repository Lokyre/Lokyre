import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtContext } from '../../context/DebtContext';

const mockNavigation = { navigate: jest.fn() };

const mockDebts = [
  { id: '1', name: 'Laptop', amount: 1200, category: 'Créditos', isPaid: false },
  { id: '2', name: 'Phone', amount: 800, category: 'Tarjetas', isPaid: true },
];

describe('HomeScreen', () => {
  it('renders correctly and calculates total unpaid debts', () => {
    const { getByText, getByTestId } = render(
      <DebtContext.Provider value={{ debts: mockDebts }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    // Should only sum unpaid debts (1200)
    expect(getByText('$1200.00')).toBeTruthy();

    // Check if debt names appear
    expect(getByText('Laptop')).toBeTruthy();
    expect(getByText('Phone')).toBeTruthy();

    expect(getByTestId('add-debt-fab')).toBeTruthy();
  });
});
