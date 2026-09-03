import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddEditDebtScreen from '../src/screens/AddEditDebtScreen';
import { DebtContext } from '../src/context/DebtContext';

const mockNavigation = {
  goBack: jest.fn(),
};

describe('AddEditDebtScreen', () => {
  it('adds a new debt', () => {
    const addDebtMock = jest.fn();
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [], addDebt: addDebtMock }}>
        <AddEditDebtScreen route={{ params: {} }} navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    fireEvent.changeText(getByTestId('input-name'), 'Nuevo Credito');
    fireEvent.changeText(getByTestId('input-amount'), '500');
    fireEvent.press(getByTestId('radio-credito'));
    fireEvent.press(getByTestId('save-button'));

    expect(addDebtMock).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Nuevo Credito',
      amount: 500,
      category: 'credito'
    }));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('populates fields when editing an existing debt', () => {
    const mockDebts = [{ id: '1', name: 'Deuda Vieja', amount: 300, category: 'tarjeta' }];
    const updateDebtMock = jest.fn();

    const { getByTestId, getByDisplayValue } = render(
      <DebtContext.Provider value={{ debts: mockDebts, updateDebt: updateDebtMock }}>
        <AddEditDebtScreen route={{ params: { debtId: '1' } }} navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    expect(getByDisplayValue('Deuda Vieja')).toBeTruthy();
    expect(getByDisplayValue('300')).toBeTruthy();

    fireEvent.changeText(getByTestId('input-amount'), '400');
    fireEvent.press(getByTestId('save-button'));

    expect(updateDebtMock).toHaveBeenCalledWith('1', expect.objectContaining({
      name: 'Deuda Vieja',
      amount: 400,
      category: 'tarjeta'
    }));
  });
});
