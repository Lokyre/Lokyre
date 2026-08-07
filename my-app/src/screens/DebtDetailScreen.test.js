import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtDetailScreen from './DebtDetailScreen';
import { DebtContext } from '../context/DebtContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

describe('DebtDetailScreen', () => {
  it('renders correctly', () => {
    const debts = [
      { id: '1', titulo: 'Debt 1', monto: 100, categoria: 'Personas', fecha: '2023-01-01' }
    ];
    useRoute.mockReturnValue({ params: { id: '1' } });

    const { getByText } = render(
      <DebtContext.Provider value={{ debts }}>
        <DebtDetailScreen />
      </DebtContext.Provider>
    );

    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Monto: $100')).toBeTruthy();
  });

  it('handles delete action', () => {
    const deleteDebtMock = jest.fn();
    const goBackMock = jest.fn();
    const debts = [{ id: '1', titulo: 'Debt 1' }];

    useRoute.mockReturnValue({ params: { id: '1' } });
    useNavigation.mockReturnValue({ goBack: goBackMock });

    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Simulate pressing "Sí"
      buttons[1].onPress();
    });

    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts, deleteDebt: deleteDebtMock }}>
        <DebtDetailScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('btn-delete'));

    expect(deleteDebtMock).toHaveBeenCalledWith('1');
    expect(goBackMock).toHaveBeenCalled();
  });
});
