import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtFormScreen from '../src/screens/DebtFormScreen';
import { useDebts } from '../src/context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

jest.mock('../src/context/DebtContext', () => ({
  useDebts: jest.fn(),
}));

describe('DebtFormScreen', () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();
  const mockAddDebt = jest.fn();
  const mockUpdateDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({
      navigate: mockNavigate,
      goBack: mockGoBack,
    });
    useRoute.mockReturnValue({ params: {} });
    useDebts.mockReturnValue({
      addDebt: mockAddDebt,
      updateDebt: mockUpdateDebt,
    });
  });

  it('should render new debt form correctly', () => {
    const { getByText, getAllByText, getByTestId } = render(<DebtFormScreen />);

    expect(getByTestId('debt-title-input')).toBeTruthy();
    expect(getByTestId('debt-amount-input')).toBeTruthy();
    expect(getByText('Tipo de Deuda:')).toBeTruthy();
    expect(getAllByText('Tarjeta').length).toBeGreaterThan(0);
    expect(getByText('Guardar Deuda')).toBeTruthy();
  });

  it('should render edit debt form correctly with populated values', () => {
    useRoute.mockReturnValue({
      params: {
        debt: { id: '1', title: 'Old Debt', amount: 150, type: 'Persona' },
      },
    });

    const { getByText, getByTestId } = render(<DebtFormScreen />);

    // Inputs in React Native Paper use 'value' prop on internal text input
    expect(getByTestId('debt-title-input').props.value).toBe('Old Debt');
    expect(getByTestId('debt-amount-input').props.value).toBe('150');
    expect(getByText('Actualizar Deuda')).toBeTruthy();
  });

  it('should call addDebt and goBack on valid submit', () => {
    const { getByTestId } = render(<DebtFormScreen />);

    fireEvent.changeText(getByTestId('debt-title-input'), 'New Debt');
    fireEvent.changeText(getByTestId('debt-amount-input'), '200');

    fireEvent.press(getByTestId('radio-row-Crédito')); // Press the row containing the radio and label
    fireEvent.press(getByTestId('save-debt-button'));

    expect(mockAddDebt).toHaveBeenCalledWith('New Debt', '200', 'Crédito');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should call updateDebt and goBack on valid edit submit', () => {
    useRoute.mockReturnValue({
      params: {
        debt: { id: '1', title: 'Old Debt', amount: 150, type: 'Persona' },
      },
    });

    const { getByTestId } = render(<DebtFormScreen />);

    fireEvent.changeText(getByTestId('debt-amount-input'), '300');
    fireEvent.press(getByTestId('radio-row-Otro')); // Press the row containing the radio and label
    fireEvent.press(getByTestId('save-debt-button'));

    expect(mockUpdateDebt).toHaveBeenCalledWith('1', 'Old Debt', '300', 'Otro');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should show alert and not submit if title or amount is missing', () => {
    const mockAlert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByTestId } = render(<DebtFormScreen />);

    // Missing amount
    fireEvent.changeText(getByTestId('debt-title-input'), 'New Debt');
    fireEvent.press(getByTestId('save-debt-button'));

    expect(mockAlert).toHaveBeenCalledWith('Error', 'Por favor completa el título y el monto.');
    expect(mockAddDebt).not.toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();

    mockAlert.mockRestore();
  });
});
