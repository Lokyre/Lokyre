import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddDebtScreen from '../src/screens/AddDebtScreen';
import { DebtContext } from '../src/context/DebtContext';

const mockNavigation = {
  goBack: jest.fn(),
};

describe('AddDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can add a new debt', () => {
    const addDebtMock = jest.fn();

    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [], addDebt: addDebtMock }}>
        <AddDebtScreen navigation={mockNavigation} route={{}} />
      </DebtContext.Provider>
    );

    fireEvent.changeText(getByTestId('input-description'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '150');
    fireEvent.press(getByTestId('radio-Créditos'));

    fireEvent.press(getByTestId('btn-save'));

    expect(addDebtMock).toHaveBeenCalledWith({
      description: 'New Debt',
      amount: 150,
      category: 'Créditos'
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('can edit an existing debt', () => {
    const updateDebtMock = jest.fn();
    const existingDebts = [
      { id: '1', description: 'Old Debt', amount: 100, category: 'Tarjetas', paid: false }
    ];

    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: existingDebts, updateDebt: updateDebtMock }}>
        <AddDebtScreen navigation={mockNavigation} route={{ params: { debtId: '1' } }} />
      </DebtContext.Provider>
    );

    expect(getByTestId('input-description').props.value).toBe('Old Debt');
    expect(getByTestId('input-amount').props.value).toBe('100');

    fireEvent.changeText(getByTestId('input-amount'), '200');
    fireEvent.press(getByTestId('btn-save'));

    expect(updateDebtMock).toHaveBeenCalledWith({
      id: '1',
      description: 'Old Debt',
      amount: 200,
      category: 'Tarjetas',
      paid: false
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
