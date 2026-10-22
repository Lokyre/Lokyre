import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtContext } from '../../context/DebtContext';
import AddDebtScreen from '../AddDebtScreen';

// Mock Alert to avoid testing environment errors
jest.spyOn(require('react-native').Alert, 'alert').mockImplementation(() => {});

const renderWithContext = (component, contextValue) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={contextValue}>
        {component}
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('AddDebtScreen', () => {
  it('shows alert when name or amount is empty', () => {
    const mockAddDebt = jest.fn();
    const mockContext = { addDebt: mockAddDebt };

    const { getByTestId } = renderWithContext(<AddDebtScreen navigation={{}} />, mockContext);

    fireEvent.press(getByTestId('btn-save'));

    expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor completa el nombre y el monto.'
    );
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('shows alert when amount is invalid', () => {
    const mockAddDebt = jest.fn();
    const mockContext = { addDebt: mockAddDebt };

    const { getByTestId } = renderWithContext(<AddDebtScreen navigation={{}} />, mockContext);

    fireEvent.changeText(getByTestId('input-name'), 'TV');
    fireEvent.changeText(getByTestId('input-amount'), '-100'); // Invalid amount
    fireEvent.press(getByTestId('btn-save'));

    expect(require('react-native').Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor ingresa un monto válido.'
    );
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('calls addDebt and navigates back with valid data', () => {
    const mockAddDebt = jest.fn();
    const mockGoBack = jest.fn();
    const mockContext = { addDebt: mockAddDebt };

    const { getByTestId, getByText } = renderWithContext(
      <AddDebtScreen navigation={{ goBack: mockGoBack }} />,
      mockContext
    );

    fireEvent.changeText(getByTestId('input-name'), 'TV');
    fireEvent.changeText(getByTestId('input-amount'), '500');
    fireEvent.press(getByTestId('radio-Personas'));
    fireEvent.press(getByTestId('btn-save'));

    expect(mockAddDebt).toHaveBeenCalledWith('TV', 500, 'Personas');
    expect(mockGoBack).toHaveBeenCalled();
  });
});
