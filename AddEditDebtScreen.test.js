import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddEditDebtScreen from './AddEditDebtScreen';
import { DebtContext } from './DebtContext';
import { Alert } from 'react-native';

describe('AddEditDebtScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockAddDebt = jest.fn();
  const mockUpdateDebt = jest.fn();

  const renderWithContext = (routeParams = {}) => {
    return render(
      <DebtContext.Provider value={{ debts: [], addDebt: mockAddDebt, updateDebt: mockUpdateDebt }}>
        <AddEditDebtScreen route={{ params: routeParams }} navigation={mockNavigation} />
      </DebtContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.alert = jest.fn();
  });

  it('validates empty inputs on save', () => {
    const { getByText } = renderWithContext();
    fireEvent.press(getByText('Guardar'));
    expect(globalThis.alert).toHaveBeenCalledWith('Error: Por favor completa el nombre y el monto.');
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('validates NaN amount on save', () => {
    const { getByText, getAllByText } = renderWithContext();

    // Fill only name and an invalid amount
    fireEvent.changeText(getAllByText('Nombre (Deudor/Acreedor)')[0], 'Test Name');
    fireEvent.changeText(getAllByText('Monto')[0], 'abc');

    fireEvent.press(getByText('Guardar'));
    expect(globalThis.alert).toHaveBeenCalledWith('Error: El monto debe ser un número válido.');
  });

  it('adds a new debt successfully', () => {
    const { getByText, getAllByText } = renderWithContext();

    fireEvent.changeText(getAllByText('Nombre (Deudor/Acreedor)')[0], 'Test Name');
    fireEvent.changeText(getAllByText('Monto')[0], '100');
    fireEvent.changeText(getAllByText('Descripción (opcional)')[0], 'Test desc');

    fireEvent.press(getByText('Guardar'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      name: 'Test Name',
      amount: 100,
      type: 'Tarjetas',
      description: 'Test desc',
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
