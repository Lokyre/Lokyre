import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddDebtScreen from '../AddDebtScreen';
import { DebtContext } from '../../context/DebtContext';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ goBack: mockGoBack }),
  };
});

describe('AddDebtScreen', () => {
  it('shows error if fields are empty', async () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ addDebt: jest.fn() }}>
        <AddDebtScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('save-button'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa título y monto');
    });
  });

  it('adds a new debt and goes back', async () => {
    const mockAddDebt = jest.fn().mockResolvedValue();
    const { getByTestId } = render(
      <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
        <AddDebtScreen />
      </DebtContext.Provider>
    );

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '150');

    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockAddDebt).toHaveBeenCalledWith({
        title: 'New Debt',
        amount: 150,
        type: 'persona',
        description: '',
      });
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});
