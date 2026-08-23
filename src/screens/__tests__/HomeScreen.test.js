import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtContext } from '../../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithContext = (debts = []) => {
    return render(
      <DebtContext.Provider value={{ debts }}>
        <HomeScreen />
      </DebtContext.Provider>
    );
  };

  it('renders total debt summary and empty list', () => {
    const { getByText } = renderWithContext([]);

    expect(getByText('Resumen de Deudas')).toBeTruthy();
    expect(getByText('Total Pendiente: $0.00')).toBeTruthy();
  });

  it('renders a list of debts', () => {
    const debts = [
      { id: '1', title: 'Car Loan', amount: 5000, category: 'Crédito' },
      { id: '2', title: 'Credit Card', amount: 200.5, category: 'Tarjeta' },
    ];
    const { getByText } = renderWithContext(debts);

    expect(getByText('Total Pendiente: $5200.50')).toBeTruthy();
    expect(getByText('Car Loan')).toBeTruthy();
    expect(getByText('Credit Card')).toBeTruthy();
  });

  it('navigates to AddEditDebt when FAB is pressed', () => {
    const { getByTestId } = renderWithContext([]);

    const fab = getByTestId('add-debt-fab');
    fireEvent.press(fab);

    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt');
  });

  it('navigates to DebtDetail when a debt is pressed', () => {
    const debts = [
      { id: '1', title: 'Car Loan', amount: 5000, category: 'Crédito' },
    ];
    const { getByTestId } = renderWithContext(debts);

    const card = getByTestId('debt-card-1');
    fireEvent.press(card);

    expect(mockNavigate).toHaveBeenCalledWith('DebtDetail', { debtId: '1' });
  });
});
