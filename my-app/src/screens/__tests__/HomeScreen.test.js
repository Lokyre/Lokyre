import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtContext } from '../../context/DebtContext';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('HomeScreen', () => {
  it('renders loading state', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [], loading: true }}>
        <HomeScreen />
      </DebtContext.Provider>
    );
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders debt list and totals correctly', () => {
    const debts = [
      { id: '1', title: 'Debt 1', amount: 100, isPaid: false, type: 'Tarjeta', dueDate: '2023-12-01' },
      { id: '2', title: 'Debt 2', amount: 50, isPaid: false, type: 'Crédito', dueDate: '2023-12-05' },
    ];

    const { getByTestId, getByText } = render(
      <DebtContext.Provider value={{ debts, loading: false }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    expect(getByText('$150.00')).toBeTruthy();
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
  });
});
