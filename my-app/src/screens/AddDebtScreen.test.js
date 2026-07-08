import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddDebtScreen from './AddDebtScreen';
import { useDebts } from '../context/DebtContext';
import { Alert } from 'react-native';

jest.mock('../context/DebtContext');

describe('AddDebtScreen', () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockAddDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDebts.mockReturnValue({ addDebt: mockAddDebt });
  });

  it('shows alert if required fields are missing', () => {
    const { getByTestId } = render(<AddDebtScreen navigation={mockNavigation} />);

    fireEvent.press(getByTestId('save-button'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor, completa el título y el monto.');
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('saves debt and navigates back', () => {
    const { getByTestId } = render(<AddDebtScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '150');
    fireEvent.press(getByTestId('save-button'));

    expect(mockAddDebt).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Debt',
      amount: 150,
      type: 'Individual',
      isPaid: false
    }));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
