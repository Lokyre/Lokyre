import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

describe('HomeScreen', () => {
  it('renders correctly with debts', () => {
    const debts = [
      { id: '1', titulo: 'Debt 1', monto: 100, categoria: 'Personas', fecha: '2023-01-01' },
      { id: '2', titulo: 'Debt 2', monto: 200, categoria: 'Tarjetas', fecha: '2023-01-02' }
    ];

    const { getByText, getByTestId } = render(
      <DebtContext.Provider value={{ debts }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    expect(getByText('Total de deudas: $300.00')).toBeTruthy();
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
  });

  it('navigates to AddDebt on FAB press', () => {
    const navigateMock = jest.fn();
    useNavigation.mockReturnValue({ navigate: navigateMock });

    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [] }}>
        <HomeScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('fab-add-debt'));
    expect(navigateMock).toHaveBeenCalledWith('AddDebt');
  });
});
