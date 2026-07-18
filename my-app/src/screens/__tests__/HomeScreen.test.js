import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { useDebts } from '../../context/DebtContext';
import { useNavigation } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';

jest.mock('../../context/DebtContext', () => ({
  useDebts: jest.fn(),
}));

describe('HomeScreen', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({ navigate: mockNavigate });
  });

  const renderWithProviders = (component) => {
    return render(<PaperProvider>{component}</PaperProvider>);
  };

  it('renders loading indicator when not ready', () => {
    useDebts.mockReturnValue({ debts: [], isReady: false });
    const { UNSAFE_getByType } = renderWithProviders(<HomeScreen />);
    const ActivityIndicator = require('react-native-paper').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders list of pending debts and total amount', () => {
    useDebts.mockReturnValue({
      isReady: true,
      debts: [
        { id: '1', title: 'Debt 1', amount: '100', type: 'Tarjeta', dueDate: '01/01/2024', isPaid: false },
        { id: '2', title: 'Debt 2', amount: '200', type: 'Persona', dueDate: '02/01/2024', isPaid: false },
        { id: '3', title: 'Paid Debt', amount: '300', type: 'Individual', dueDate: '03/01/2024', isPaid: true },
      ],
    });

    const { getByText, getByTestId, queryByText } = renderWithProviders(<HomeScreen />);

    // Total should be 300 (100 + 200), paid debt is ignored
    expect(getByText('$300.00')).toBeTruthy();
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
    expect(queryByText('Paid Debt')).toBeNull();

    fireEvent.press(getByTestId('debt-card-1'));
    expect(mockNavigate).toHaveBeenCalledWith('DebtDetail', { debtId: '1' });
  });

  it('navigates to AddDebt screen when FAB is pressed', () => {
    useDebts.mockReturnValue({ isReady: true, debts: [] });
    const { getByTestId } = renderWithProviders(<HomeScreen />);

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });

  it('renders empty list message when no pending debts', () => {
    useDebts.mockReturnValue({ isReady: true, debts: [] });
    const { getByText } = renderWithProviders(<HomeScreen />);

    expect(getByText('No tienes deudas pendientes.')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });
});
