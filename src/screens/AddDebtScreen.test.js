import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AddDebtScreen from './AddDebtScreen';
import { DebtContext } from '../context/DebtContext';

describe('AddDebtScreen', () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockAddDebt = jest.fn();
  const mockUpdateDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  const renderScreen = (debts = [], routeParams = {}) => {
    return render(
      <DebtContext.Provider value={{ debts, addDebt: mockAddDebt, updateDebt: mockUpdateDebt }}>
        <AddDebtScreen navigation={mockNavigation} route={{ params: routeParams }} />
      </DebtContext.Provider>
    );
  };

  it('renders correctly for adding a new debt', () => {
    const { getByText } = renderScreen();
    expect(getByText('Nueva Deuda')).toBeTruthy();
  });

  it('shows error if title or amount is missing', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('btn-save'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa un título y un monto válidos.');
  });

  it('saves new debt successfully', () => {
    const { getByTestId } = renderScreen();

    fireEvent.changeText(getByTestId('input-title'), 'Nueva Tarjeta');
    fireEvent.changeText(getByTestId('input-amount'), '150');
    fireEvent.press(getByTestId('radio-Individuales')); // Set type
    fireEvent.press(getByTestId('btn-save'));

    expect(mockAddDebt).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Nueva Tarjeta',
      amount: 150,
      type: 'Individuales',
    }));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('renders correctly for editing and populates fields', () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 300, type: 'Créditos', dueDate: '12-12-2024', description: 'Desc' }];
    const { getByText, getByTestId } = renderScreen(mockDebts, { debtId: '1' });

    expect(getByText('Editar Deuda')).toBeTruthy();
    expect(getByTestId('input-title').props.value).toBe('Test Debt');
    expect(getByTestId('input-amount').props.value).toBe('300');
  });

  it('updates existing debt successfully', () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 300, type: 'Créditos' }];
    const { getByTestId } = renderScreen(mockDebts, { debtId: '1' });

    fireEvent.changeText(getByTestId('input-amount'), '500');
    fireEvent.press(getByTestId('btn-save'));

    expect(mockUpdateDebt).toHaveBeenCalledWith('1', expect.objectContaining({
      title: 'Test Debt',
      amount: 500,
    }));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});