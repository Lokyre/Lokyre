import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtContext } from '../context/DebtContext';
import AddDebtScreen from '../screens/AddDebtScreen';

const mockNavigation = {
  goBack: jest.fn(),
};

describe('AddDebtScreen', () => {
  it('calls addDebt and goes back when valid inputs are provided', async () => {
    const mockAddDebt = jest.fn();

    const { getByTestId, getByText } = render(
      <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
        <AddDebtScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    fireEvent.changeText(getByTestId('input-title'), 'Test Deuda');
    fireEvent.changeText(getByTestId('input-amount'), '100');
    fireEvent.changeText(getByTestId('input-date'), '01/01/2025');

    fireEvent.press(getByTestId('btn-save'));

    await waitFor(() => {
      expect(mockAddDebt).toHaveBeenCalledWith({
        title: 'Test Deuda',
        amount: 100,
        type: 'Individual',
        dueDate: '01/01/2025',
        description: '',
      });
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
