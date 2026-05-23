jest.mock("uuid", () => ({ v4: () => "test-uuid" }));

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
};

const renderWithContext = (component, debts = []) => {
  return render(
    <DebtContext.Provider value={{ debts }}>
      <PaperProvider>
        {component}
      </PaperProvider>
    </DebtContext.Provider>
  );
};

describe('HomeScreen', () => {
  it('renders correctly when there are no debts', () => {
    const { getByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('Resumen de Deudas')).toBeTruthy();
    expect(getByText('Total Pendiente: $0.00')).toBeTruthy();
    expect(getByText('No tienes deudas registradas.')).toBeTruthy();
  });

  it('calculates total pending debt correctly', () => {
    const mockDebts = [
      { id: '1', title: 'Tarjeta Visa', type: 'Tarjetas', totalAmount: 1000, payments: [] },
      { id: '2', title: 'Préstamo', type: 'Créditos', totalAmount: 500, payments: [{ amount: 100 }] }
    ];

    const { getByText } = renderWithContext(
      <HomeScreen navigation={mockNavigation} />,
      mockDebts
    );

    // 1000 (Visa) + 500 (Prestamo) - 100 (Abono) = 1400
    expect(getByText('Total Pendiente: $1400.00')).toBeTruthy();
    expect(getByText('Tarjetas: $1000.00')).toBeTruthy();
    expect(getByText('Créditos: $400.00')).toBeTruthy();
    expect(getByText('Tarjeta Visa')).toBeTruthy();
    expect(getByText('Préstamo')).toBeTruthy();
  });
});
