import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddEditDebtScreen from './AddEditDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { Alert } from 'react-native';

const mockNavigation = {
  goBack: jest.fn(),
};

const mockAddDebt = jest.fn();
const mockUpdateDebt = jest.fn();

const renderWithContext = (routeParams = {}) => {
  return render(
    <DebtContext.Provider value={{ addDebt: mockAddDebt, updateDebt: mockUpdateDebt }}>
      <AddEditDebtScreen navigation={mockNavigation} route={{ params: routeParams }} />
    </DebtContext.Provider>
  );
};

describe('AddEditDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for adding a new debt', () => {
    const { getByTestId, getByText } = renderWithContext();
    expect(getByTestId('debt-title-input')).toBeTruthy();
    expect(getByTestId('debt-amount-input')).toBeTruthy();
    expect(getByText('Guardar Deuda')).toBeTruthy();
  });

  it('renders correctly for editing an existing debt', () => {
    const debt = { id: '1', title: 'Test', amount: 100, type: 'Tarjeta', date: '2023-10-10' };
    const { getByTestId, getByText } = renderWithContext({ debt });

    expect(getByTestId('debt-title-input').props.value).toBe('Test');
    expect(getByTestId('debt-amount-input').props.value).toBe('100');
    expect(getByText('Actualizar Deuda')).toBeTruthy();
  });

  it('shows alert if title or amount is missing', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByTestId } = renderWithContext();

    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Por favor ingresa el título y el monto de la deuda.');
    });
  });

  it('calls addDebt on save', async () => {
    const { getByTestId } = renderWithContext();

    fireEvent.changeText(getByTestId('debt-title-input'), 'New Debt');
    fireEvent.changeText(getByTestId('debt-amount-input'), '50');
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockAddDebt).toHaveBeenCalled();
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
