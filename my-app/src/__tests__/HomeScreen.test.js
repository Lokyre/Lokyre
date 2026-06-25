import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { useDebts } from '../context/DebtContext';

jest.mock('../context/DebtContext', () => ({
  useDebts: jest.fn(),
}));

const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when not ready', () => {
    useDebts.mockReturnValue({ debts: [], isReady: false });
    const { UNSAFE_getByType } = render(<HomeScreen navigation={mockNavigation} />);
    const ActivityIndicator = require('react-native-paper').ActivityIndicator;
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('renders debts and total correctly', async () => {
    const mockDebts = [
      { id: '1', title: 'Debt 1', amount: 100, isPaid: false, type: 'Individual' },
      { id: '2', title: 'Debt 2', amount: 50.5, isPaid: true, type: 'Tarjeta' },
    ];
    useDebts.mockReturnValue({ debts: mockDebts, isReady: true });

    const rendered = render(<HomeScreen navigation={mockNavigation} />);

    await act(async () => {
      await Promise.resolve();
    });

    const { getByText, queryByText } = rendered;

    expect(getByText('Total Pendiente')).toBeTruthy();
    expect(getByText('$100.00')).toBeTruthy();
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen on FAB press', async () => {
    useDebts.mockReturnValue({ debts: [], isReady: true });
    const rendered = render(<HomeScreen navigation={mockNavigation} />);

    await act(async () => {
      await Promise.resolve();
    });

    const { getByTestId } = rendered;

    await act(async () => {
      fireEvent.press(getByTestId('fab'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });
});
