import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddEditDebtScreen from '../AddEditDebtScreen';
import { DebtContext } from '../../context/DebtContext';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => ({ params: {} }),
}));

describe('AddEditDebtScreen', () => {
  it('allows user to fill the form and add a debt', () => {
    const mockAddDebt = jest.fn();

    const { getByTestId } = render(
      <DebtContext.Provider value={{ addDebt: mockAddDebt, updateDebt: jest.fn(), debts: [] }}>
        <AddEditDebtScreen />
      </DebtContext.Provider>
    );

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '200');
    fireEvent.changeText(getByTestId('input-dueDate'), '2023-11-30');
    fireEvent.changeText(getByTestId('input-description'), 'Test description');

    fireEvent.press(getByTestId('save-button'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      title: 'New Debt',
      amount: 200,
      type: 'Individual', // Default type
      dueDate: '2023-11-30',
      description: 'Test description',
    });
    expect(mockGoBack).toHaveBeenCalled();
  });
});
