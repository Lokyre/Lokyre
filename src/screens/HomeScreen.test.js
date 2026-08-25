import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';

describe('HomeScreen', () => {
  it('renders total pending debt correctly', () => {
    const mockContextValue = {
      debts: [
        { id: '1', amount: 100, status: 'pendiente' },
        { id: '2', amount: 50, status: 'pagado' },
        { id: '3', amount: 200, status: 'pendiente' },
      ],
    };

    const { getByText } = render(
      <DebtContext.Provider value={mockContextValue}>
        <HomeScreen navigation={{ navigate: jest.fn() }} />
      </DebtContext.Provider>
    );

    expect(getByText('$300.00')).toBeTruthy();
    expect(getByText('Deudas Pendientes: 2')).toBeTruthy();
    expect(getByText('Deudas Pagadas: 1')).toBeTruthy();
  });
});
