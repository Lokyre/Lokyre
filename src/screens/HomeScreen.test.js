import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { useDebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';

jest.mock('../context/DebtContext', () => ({
  useDebtContext: jest.fn(),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders total debt and categories', () => {
    useDebtContext.mockReturnValue({
      getCategorizedDebts: () => ({
        'Tarjetas': [{ id: '1', title: 'Visa', amount: 100 }],
        'Créditos': [],
        'Personas': [],
        'Individuales': []
      }),
      getTotalDebt: () => 100,
      deleteDebt: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);

    expect(getByText('$100.00')).toBeTruthy();
    expect(getByText('Tarjetas')).toBeTruthy();
    expect(getByText('Visa')).toBeTruthy();
    expect(getByText('Monto: $100')).toBeTruthy();
  });

  it('navigates to AddDebt screen on FAB press', () => {
    useDebtContext.mockReturnValue({
      getCategorizedDebts: () => ({ 'Tarjetas': [], 'Créditos': [], 'Personas': [], 'Individuales': [] }),
      getTotalDebt: () => 0,
      deleteDebt: jest.fn(),
    });

    const mockNavigate = jest.fn();
    const navigation = { navigate: mockNavigate };

    const { getByTestId } = render(<HomeScreen navigation={navigation} />);

    fireEvent.press(getByTestId('add-debt-fab'));

    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });
});
