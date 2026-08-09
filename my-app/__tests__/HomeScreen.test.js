import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { useDebts } from '../src/context/DebtContext';
import { useNavigation } from '@react-navigation/native';

// Mock the hook
jest.mock('../src/context/DebtContext', () => ({
  useDebts: jest.fn(),
}));

describe('HomeScreen', () => {
  const mockNavigate = jest.fn();
  const mockDeleteDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('should render empty state correctly', () => {
    useDebts.mockReturnValue({ debts: [], deleteDebt: mockDeleteDebt });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('Total de Deudas')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
    expect(getByText('No hay deudas pendientes.')).toBeTruthy();
  });

  it('should render debts list correctly', () => {
    const mockDebts = [
      { id: '1', title: 'Car Loan', amount: 5000, type: 'Crédito' },
      { id: '2', title: 'Dinner', amount: 50, type: 'Persona' },
    ];
    useDebts.mockReturnValue({ debts: mockDebts, deleteDebt: mockDeleteDebt });

    const { getByText, getByTestId } = render(<HomeScreen />);

    expect(getByText('Total de Deudas')).toBeTruthy();
    expect(getByText('$5050.00')).toBeTruthy();

    // Test individual items
    expect(getByText('Car Loan')).toBeTruthy();
    expect(getByText('Crédito - $5000.00')).toBeTruthy();
    expect(getByText('Dinner')).toBeTruthy();
    expect(getByText('Persona - $50.00')).toBeTruthy();
  });

  it('should navigate to DebtForm when FAB is pressed', () => {
    useDebts.mockReturnValue({ debts: [], deleteDebt: mockDeleteDebt });

    const { getByTestId } = render(<HomeScreen />);
    fireEvent.press(getByTestId('add-debt-fab'));

    expect(mockNavigate).toHaveBeenCalledWith('DebtForm');
  });

  it('should navigate to DebtForm with debt params when a card is pressed', () => {
    const mockDebts = [{ id: '1', title: 'Car Loan', amount: 5000, type: 'Crédito' }];
    useDebts.mockReturnValue({ debts: mockDebts, deleteDebt: mockDeleteDebt });

    const { getByTestId } = render(<HomeScreen />);
    fireEvent.press(getByTestId('debt-card-1'));

    expect(mockNavigate).toHaveBeenCalledWith('DebtForm', { debt: mockDebts[0] });
  });

  it('should call deleteDebt when delete icon is pressed', () => {
    const mockDebts = [{ id: '1', title: 'Car Loan', amount: 5000, type: 'Crédito' }];
    useDebts.mockReturnValue({ debts: mockDebts, deleteDebt: mockDeleteDebt });

    const { getByTestId } = render(<HomeScreen />);

    fireEvent.press(getByTestId('delete-debt-1'));

    expect(mockDeleteDebt).toHaveBeenCalledWith('1');
  });
});
