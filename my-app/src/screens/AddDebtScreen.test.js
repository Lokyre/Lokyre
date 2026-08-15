import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddDebtScreen from './AddDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { Alert } from 'react-native';

const mockNavigation = { goBack: jest.fn() };
const mockAddDebt = jest.fn();

const renderWithContext = () => {
  return render(
    <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
      <AddDebtScreen navigation={mockNavigation} />
    </DebtContext.Provider>
  );
};

describe('AddDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId, getByText } = renderWithContext();
    expect(getByTestId('description-input')).toBeTruthy();
    expect(getByTestId('amount-input')).toBeTruthy();
    expect(getByText('Guardar Deuda')).toBeTruthy();
  });

  it('shows alert if fields are empty', () => {
    const { getByTestId } = renderWithContext();
    fireEvent.press(getByTestId('submit-button'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor, completa todos los campos.');
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('adds debt successfully', () => {
    const { getByTestId } = renderWithContext();
    fireEvent.changeText(getByTestId('description-input'), 'New Debt');
    fireEvent.changeText(getByTestId('amount-input'), '500');
    fireEvent.press(getByTestId('submit-button'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      description: 'New Debt',
      amount: '500.00',
      type: 'Individual',
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
