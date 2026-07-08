import React from 'react';
import { render, fireEvent, UNSAFE_getByType } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { useDebts } from '../context/DebtContext';
import { ActivityIndicator } from 'react-native-paper';

jest.mock('../context/DebtContext');

describe('HomeScreen', () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading indicator when loading', () => {
    useDebts.mockReturnValue({ debts: [], isLoading: true });
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('renders empty state message', () => {
    useDebts.mockReturnValue({ debts: [], isLoading: false });
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
  });

  it('renders list of debts', () => {
    const debts = [
      { id: '1', title: 'Debt 1', type: 'Tarjeta', amount: 100, isPaid: false },
      { id: '2', title: 'Debt 2', type: 'Crédito', amount: 200, isPaid: true },
    ];
    useDebts.mockReturnValue({ debts, isLoading: false });

    const { getByTestId, getAllByText } = render(<HomeScreen navigation={mockNavigation} />);

    expect(getByTestId('debt-title-1')).toBeTruthy();
    expect(getByTestId('debt-title-2')).toBeTruthy();
  });

  it('navigates to AddDebt screen on FAB press', () => {
    useDebts.mockReturnValue({ debts: [], isLoading: false });
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });

  it('navigates to DebtDetail screen on card press', () => {
    const debts = [{ id: '1', title: 'Debt 1', type: 'Tarjeta', amount: 100, isPaid: false }];
    useDebts.mockReturnValue({ debts, isLoading: false });

    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    fireEvent.press(getByTestId('debt-card-1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { id: '1' });
  });
});
