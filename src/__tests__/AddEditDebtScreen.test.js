import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddEditDebtScreen from '../screens/AddEditDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { Alert } from 'react-native';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
let mockRouteParams = {};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => ({ params: mockRouteParams }),
}));

describe('AddEditDebtScreen', () => {
  const mockAddDebt = jest.fn();
  const mockUpdateDebt = jest.fn();
  const mockDebts = [{ id: '1', name: 'Existing Debt', amount: 100, type: 'Crédito' }];

  const renderScreen = () => render(
    <DebtContext.Provider value={{ debts: mockDebts, addDebt: mockAddDebt, updateDebt: mockUpdateDebt }}>
      <AddEditDebtScreen />
    </DebtContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouteParams = {};
  });

  it('shows error if name or amount is empty', () => {
    const spyAlert = jest.spyOn(Alert, 'alert');
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('save-button'));
    expect(spyAlert).toHaveBeenCalledWith('Error', 'Por favor ingresa un nombre y un monto válido.');
    spyAlert.mockRestore();
  });

  it('adds a new debt when form is valid', () => {
    const { getByTestId } = renderScreen();

    fireEvent.changeText(getByTestId('input-name'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '250.50');
    fireEvent.press(getByTestId('radio-persona'));

    fireEvent.press(getByTestId('save-button'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      name: 'New Debt',
      amount: 250.50,
      type: 'Persona',
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('updates an existing debt when editing', () => {
    mockRouteParams = { debtId: '1' };
    const { getByTestId } = renderScreen();

    // The fields should be pre-filled
    expect(getByTestId('input-name').props.value).toBe('Existing Debt');
    expect(getByTestId('input-amount').props.value).toBe('100');

    // Change value
    fireEvent.changeText(getByTestId('input-name'), 'Updated Debt Name');
    fireEvent.press(getByTestId('save-button'));

    expect(mockUpdateDebt).toHaveBeenCalledWith('1', {
      name: 'Updated Debt Name',
      amount: 100,
      type: 'Crédito', // assuming it stays Crédito since we didn't change the radio
    });
    expect(mockGoBack).toHaveBeenCalled();
  });
});
