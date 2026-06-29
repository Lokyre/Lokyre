import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtContext } from '../../context/DebtContext';
import { NavigationContainer } from '@react-navigation/native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('HomeScreen', () => {
  it('renders correctly with no debts', async () => {
    const mockContextValue = {
      debts: [],
      loading: false,
      toggleDebtStatus: jest.fn(),
      deleteDebt: jest.fn(),
    };

    let component;
    component = render(
      <DebtContext.Provider value={mockContextValue}>
        <NavigationContainer>
          <HomeScreen />
        </NavigationContainer>
      </DebtContext.Provider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(component.getByText('No tienes deudas registradas.')).toBeTruthy();
  });

  it('renders correctly with debts and navigates to AddDebt', async () => {
    const mockContextValue = {
      debts: [
        { id: '1', title: 'Deuda Prueba', amount: 100, type: 'Tarjeta', dueDate: '2023-12-31', isPaid: false }
      ],
      loading: false,
      toggleDebtStatus: jest.fn(),
      deleteDebt: jest.fn(),
    };

    let component;
    component = render(
      <DebtContext.Provider value={mockContextValue}>
        <NavigationContainer>
          <HomeScreen />
        </NavigationContainer>
      </DebtContext.Provider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(component.getByText('Deuda Prueba')).toBeTruthy();
    expect(component.getByText('Monto: $100 - Tipo: Tarjeta')).toBeTruthy();

    const fab = component.getByTestId('fab');
    fireEvent.press(fab);
    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });
});
