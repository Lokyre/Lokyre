import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddDebtScreen from '../AddDebtScreen';
import { DebtContext } from '../../context/DebtContext';
import { Alert, Platform } from 'react-native';

const mockNavigation = {
  goBack: jest.fn(),
};

const mockAddDebt = jest.fn();

const renderWithContext = (component) => {
  return render(
    <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
      {component}
    </DebtContext.Provider>
  );
};

describe('AddDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields correctly', () => {
    const { getByText, getByTestId } = renderWithContext(<AddDebtScreen navigation={mockNavigation} />);

    expect(getByTestId('name-input')).toBeTruthy();
    expect(getByTestId('amount-input')).toBeTruthy();
    expect(getByText('Guardar Deuda')).toBeTruthy();
  });

  it('shows error if name is empty', () => {
    const { getByText } = renderWithContext(<AddDebtScreen navigation={mockNavigation} />);

    fireEvent.press(getByText('Guardar Deuda'));

    if (Platform.OS === 'web') {
      expect(globalThis.alert).toHaveBeenCalledWith(expect.stringContaining('nombre'));
    } else {
      expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('nombre'));
    }

    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('shows error if amount is invalid', () => {
    const { getByText, getByTestId } = renderWithContext(<AddDebtScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByTestId('name-input'), 'Test');
    fireEvent.changeText(getByTestId('amount-input'), '-10');
    fireEvent.press(getByText('Guardar Deuda'));

    if (Platform.OS === 'web') {
      expect(globalThis.alert).toHaveBeenCalledWith(expect.stringContaining('monto válido'));
    } else {
      expect(Alert.alert).toHaveBeenCalledWith('Error', expect.stringContaining('monto válido'));
    }

    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('adds debt and navigates back on valid submission', () => {
    const { getByText, getByTestId } = renderWithContext(<AddDebtScreen navigation={mockNavigation} />);

    fireEvent.changeText(getByTestId('name-input'), 'New Debt');
    fireEvent.changeText(getByTestId('amount-input'), '500');

    // Test native component behavior directly due to react-native-paper nested radio wrapper
    // The default selection is 'Tarjetas', so we just leave it to default for simplest valid test path

    fireEvent.press(getByText('Guardar Deuda'));

    expect(mockAddDebt).toHaveBeenCalledWith('New Debt', '500', 'Tarjetas');
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
