import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/context/DebtContext';

const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('HomeScreen', () => {
  it('renders empty state correctly', () => {
    const { getByText } = render(
      <DebtContext.Provider value={{ debts: [], deleteDebt: jest.fn() }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    expect(getByText('No hay deudas registradas.')).toBeTruthy();
    expect(getByText('Total Pendiente: $0.00')).toBeTruthy();
  });

  it('renders list of debts and calculates total', () => {
    const mockDebts = [
      { id: '1', name: 'Juan', amount: 100, category: 'persona' },
      { id: '2', name: 'Visa', amount: 250.5, category: 'tarjeta' },
    ];

    const { getByText } = render(
      <DebtContext.Provider value={{ debts: mockDebts, deleteDebt: jest.fn() }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    expect(getByText('Juan')).toBeTruthy();
    expect(getByText('Visa')).toBeTruthy();
    expect(getByText('Total Pendiente: $350.50')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen on FAB press', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [], deleteDebt: jest.fn() }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('add-fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });

  it('calls deleteDebt when delete icon is pressed', () => {
    const deleteDebtMock = jest.fn();
    const mockDebts = [{ id: '1', name: 'Juan', amount: 100, category: 'persona' }];

    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: mockDebts, deleteDebt: deleteDebtMock }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('delete-button-1'));
    expect(deleteDebtMock).toHaveBeenCalledWith('1');
  });
});
