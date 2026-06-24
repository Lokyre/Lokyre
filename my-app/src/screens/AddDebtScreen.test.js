import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AddDebtScreen from './AddDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';

const mockNavigation = {
  goBack: jest.fn()
};

const mockAddDebt = jest.fn();

const defaultContextValue = {
  addDebt: mockAddDebt
};

const renderScreen = (contextValue = defaultContextValue) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={contextValue}>
        <AddDebtScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('AddDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows error alert when title or amount is missing', () => {
    const { getByTestId } = renderScreen();
    fireEvent.press(getByTestId('btn-save'));
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa al menos el título y el monto.');
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('shows error alert when amount is invalid', () => {
    const { getByTestId } = renderScreen();

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), 'abc');

    fireEvent.press(getByTestId('btn-save'));

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa un monto válido.');
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('calls addDebt and navigates back on successful save', () => {
    const { getByTestId } = renderScreen();

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '200');

    fireEvent.press(getByTestId('btn-save'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      title: 'New Debt',
      amount: 200,
      type: 'Tarjeta',
      dueDate: '',
      description: ''
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
