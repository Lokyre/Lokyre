import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { useDebts } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

jest.mock('../context/DebtContext', () => ({
  useDebts: jest.fn(),
}));

describe('HomeScreen', () => {
  const mockNavigate = jest.fn();
  const mockDeleteDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({ navigate: mockNavigate });
  });

  it('renders loading state when not loaded', () => {
    useDebts.mockReturnValue({ debts: [], deleteDebt: mockDeleteDebt, isLoaded: false });
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Cargando...')).toBeTruthy();
  });

  it('renders empty state when no debts exist', () => {
    useDebts.mockReturnValue({ debts: [], deleteDebt: mockDeleteDebt, isLoaded: true });
    const { getByText } = render(<HomeScreen />);
    expect(getByText('No tienes deudas pendientes.')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy(); // Total
  });

  it('renders a list of debts and calculates total sum', () => {
    const mockDebts = [
      { id: '1', title: 'Debt 1', amount: 100, type: 'Tarjeta' },
      { id: '2', title: 'Debt 2', amount: 50.5, type: 'Crédito' },
    ];
    useDebts.mockReturnValue({ debts: mockDebts, deleteDebt: mockDeleteDebt, isLoaded: true });

    const { getByText, getByTestId } = render(<HomeScreen />);

    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
    expect(getByText('$150.50')).toBeTruthy(); // Total sum
  });

  it('navigates to AddEditDebtScreen when FAB is pressed', () => {
    useDebts.mockReturnValue({ debts: [], deleteDebt: mockDeleteDebt, isLoaded: true });
    const { getByTestId } = render(<HomeScreen />);

    fireEvent.press(getByTestId('add-debt-fab'));
    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt');
  });

  it('calls deleteDebt when delete icon is pressed', () => {
    const mockDebts = [{ id: '1', title: 'Debt 1', amount: 100, type: 'Tarjeta' }];
    useDebts.mockReturnValue({ debts: mockDebts, deleteDebt: mockDeleteDebt, isLoaded: true });

    const { getByTestId } = render(<HomeScreen />);

    fireEvent.press(getByTestId('delete-btn-1'));
    expect(mockDeleteDebt).toHaveBeenCalledWith('1');
  });
});
