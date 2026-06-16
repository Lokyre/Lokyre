import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { PaperProvider, TextInput } from 'react-native-paper';
import { Alert } from 'react-native';
import AddDebtScreen from '../src/screens/AddDebtScreen';
import { DebtContext } from '../src/context/DebtContext';

const mockNavigation = { goBack: jest.fn() };
const mockAddDebt = jest.fn();

const renderWithContext = () => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={{ addDebt: mockAddDebt }}>
        <AddDebtScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('AddDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls addDebt with correct values when form is submitted', async () => {
    const { getByText, UNSAFE_getAllByType } = renderWithContext();

    const inputs = UNSAFE_getAllByType(TextInput);

    // Title input
    fireEvent.changeText(inputs[0], 'New Debt');
    // Amount input
    fireEvent.changeText(inputs[1], '200');

    const saveButton = getByText('Guardar Deuda');

    await act(async () => {
      fireEvent.press(saveButton);
    });

    expect(mockAddDebt).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Debt',
      amount: '200',
      type: 'Tarjeta',
    }));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('shows alert if required fields are missing', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderWithContext();

    const saveButton = getByText('Guardar Deuda');

    await act(async () => {
      fireEvent.press(saveButton);
    });

    // In AddDebtScreen, we used the global `alert`, we should probably change it to Alert.alert for React Native or mock the global properly.
    // For now, I will update AddDebtScreen to use Alert.alert which is standard in React Native.
    expect(alertSpy).toHaveBeenCalledWith('Por favor, ingresa el título y el monto.');
    expect(mockAddDebt).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });
});
