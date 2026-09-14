import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddEditDebtScreen from '../screens/AddEditDebtScreen';
import { useDebts } from '../context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

jest.mock('../context/DebtContext', () => ({
  useDebts: jest.fn(),
}));

describe('AddEditDebtScreen', () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();
  const mockAddDebt = jest.fn();
  const mockUpdateDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({ navigate: mockNavigate, goBack: mockGoBack });
    useRoute.mockReturnValue({ params: {} });
    useDebts.mockReturnValue({ debts: [], addDebt: mockAddDebt, updateDebt: mockUpdateDebt });
  });

  it('renders form in add mode correctly', () => {
    const { getByText, getByTestId } = render(<AddEditDebtScreen />);

    expect(getByText('Nueva Deuda')).toBeTruthy();
    expect(getByTestId('input-title')).toBeTruthy();
    expect(getByTestId('input-amount')).toBeTruthy();
  });

  it('renders form in edit mode and populates data', () => {
    const mockDebts = [{ id: '1', title: 'Old Debt', amount: 200, type: 'Otro', description: 'Desc' }];
    useDebts.mockReturnValue({ debts: mockDebts, addDebt: mockAddDebt, updateDebt: mockUpdateDebt });
    useRoute.mockReturnValue({ params: { debtId: '1' } });

    const { getByText, getByTestId } = render(<AddEditDebtScreen />);

    expect(getByText('Editar Deuda')).toBeTruthy();
    expect(getByTestId('input-title').props.value).toBe('Old Debt');
    expect(getByTestId('input-amount').props.value).toBe('200');
    expect(getByTestId('input-description').props.value).toBe('Desc');
  });

  it('shows alert if required fields are missing', () => {
    globalThis.alert = jest.fn();

    const { getByTestId } = render(<AddEditDebtScreen />);

    fireEvent.press(getByTestId('save-button'));

    expect(globalThis.alert).toHaveBeenCalledWith('Por favor completa el título y el monto.');
    expect(mockAddDebt).not.toHaveBeenCalled();
    delete globalThis.alert;
  });

  it('saves new debt and navigates back', () => {
    const { getByTestId } = render(<AddEditDebtScreen />);

    fireEvent.changeText(getByTestId('input-title'), 'Test Title');
    fireEvent.changeText(getByTestId('input-amount'), '100');
    fireEvent.press(getByTestId('radio-credito'));
    fireEvent.changeText(getByTestId('input-description'), 'Test Desc');

    fireEvent.press(getByTestId('save-button'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      title: 'Test Title',
      amount: 100,
      type: 'Crédito',
      description: 'Test Desc',
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('updates existing debt and navigates back', () => {
    const mockDebts = [{ id: '1', title: 'Old Debt', amount: 200, type: 'Otro', description: 'Desc' }];
    useDebts.mockReturnValue({ debts: mockDebts, addDebt: mockAddDebt, updateDebt: mockUpdateDebt });
    useRoute.mockReturnValue({ params: { debtId: '1' } });

    const { getByTestId } = render(<AddEditDebtScreen />);

    fireEvent.changeText(getByTestId('input-amount'), '300');

    fireEvent.press(getByTestId('save-button'));

    expect(mockUpdateDebt).toHaveBeenCalledWith({
      id: '1',
      title: 'Old Debt',
      amount: 300,
      type: 'Otro',
      description: 'Desc',
    });
    expect(mockGoBack).toHaveBeenCalled();
  });
});
