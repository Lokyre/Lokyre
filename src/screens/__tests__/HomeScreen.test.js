import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtContext } from '../../context/DebtContext';

const mockNavigation = {
  navigate: jest.fn(),
};

const renderWithContext = (component, debts = []) => {
  return render(
    <DebtContext.Provider value={{ debts }}>
      {component}
    </DebtContext.Provider>
  );
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with no debts', () => {
    const { getByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />);

    expect(getByText('Deuda Total')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
    expect(getByText('No tienes deudas pendientes.')).toBeTruthy();
  });

  it('renders a list of debts and calculates total', () => {
    const debts = [
      { id: '1', name: 'Debt 1', amount: 100, type: 'Tarjetas' },
      { id: '2', name: 'Debt 2', amount: 250.5, type: 'Personas' }
    ];

    const { getByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />, debts);

    expect(getByText('$350.50')).toBeTruthy();
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Monto: $100.00')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
    expect(getByText('Monto: $250.50')).toBeTruthy();
  });

  it('navigates to AddDebt screen on FAB press', () => {
    const { getByTestId } = renderWithContext(<HomeScreen navigation={mockNavigation} />);

    const fab = getByTestId('add-debt-fab');
    fireEvent.press(fab);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });

  it('navigates to DebtDetails screen on card press', () => {
    const debts = [
      { id: '1', name: 'Debt 1', amount: 100, type: 'Tarjetas' }
    ];

    const { getByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />, debts);

    fireEvent.press(getByText('Debt 1'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetails', { debtId: '1' });
  });
});
