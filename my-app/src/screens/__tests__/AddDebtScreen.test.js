import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddDebtScreen from '../AddDebtScreen';
import { DebtContext } from '../../context/DebtContext';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    goBack: jest.fn(),
  })),
}));

describe('AddDebtScreen', () => {
  const mockAddDebt = jest.fn();
  const mockGoBack = jest.fn();

  beforeEach(() => {
    useNavigation.mockReturnValue({ goBack: mockGoBack });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    mockAddDebt.mockClear();
    mockGoBack.mockClear();
    Alert.alert.mockClear();
  });

  it('validates empty inputs', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
        <AddDebtScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('btn-save'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa un título y un monto.');
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('validates numeric inputs', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
        <AddDebtScreen />
      </DebtContext.Provider>
    );

    fireEvent.changeText(getByTestId('input-title'), 'Test');
    fireEvent.changeText(getByTestId('input-amount'), '-50');
    fireEvent.press(getByTestId('btn-save'));

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa un monto válido mayor a 0.');
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('adds a new debt successfully', async () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
        <AddDebtScreen />
      </DebtContext.Provider>
    );

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '150');
    fireEvent.press(getByTestId('btn-save'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      title: 'New Debt',
      amount: 150,
      type: 'Individual', // Default
    });
    // the mocked addDebt might be async, ensure to await if testing internal logic, but since we mocked it returning promise:
    await Promise.resolve();
    expect(mockGoBack).toHaveBeenCalled();
  });
});
