import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddDebtScreen from './AddDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

describe('AddDebtScreen', () => {
  it('calls addDebt and navigates back when saving valid form', () => {
    const addDebtMock = jest.fn();
    const goBackMock = jest.fn();
    useNavigation.mockReturnValue({ goBack: goBackMock });

    const { getByTestId } = render(
      <DebtContext.Provider value={{ addDebt: addDebtMock }}>
        <AddDebtScreen />
      </DebtContext.Provider>
    );

    fireEvent.changeText(getByTestId('input-titulo'), 'New Loan');
    fireEvent.changeText(getByTestId('input-monto'), '150');
    fireEvent.press(getByTestId('btn-save'));

    expect(addDebtMock).toHaveBeenCalledWith(expect.objectContaining({
      titulo: 'New Loan',
      monto: 150,
      categoria: 'Tarjetas',
    }));
    expect(goBackMock).toHaveBeenCalled();
  });

  it('shows alert when trying to save without title or amount', () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const windowAlert = jest.fn();
global.alert = windowAlert;

    const { getByTestId } = render(
      <DebtContext.Provider value={{ addDebt: jest.fn() }}>
        <AddDebtScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('btn-save'));
    expect(windowAlert).toHaveBeenCalledWith('Por favor complete título y monto');

  });
});
