import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddDebtScreen from '../src/screens/AddDebtScreen';
import { DebtContext } from '../src/DebtContext';
import { Alert } from 'react-native';

const mockGoBack = jest.fn();
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
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('shows error if fields are empty', async () => {
    const { getByTestId } = renderWithContext(
      <AddDebtScreen navigation={{ goBack: mockGoBack }} />
    );

    fireEvent.press(getByTestId('save-button'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa al menos un título y un monto.');
    });
    expect(mockAddDebt).not.toHaveBeenCalled();
  });

  it('saves debt and goes back', async () => {
    const { getByTestId } = renderWithContext(
      <AddDebtScreen navigation={{ goBack: mockGoBack }} />
    );

    fireEvent.changeText(getByTestId('input-title'), 'Test Title');
    fireEvent.changeText(getByTestId('input-amount'), '100');

    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockAddDebt).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Title',
        amount: '100',
        type: 'Individual', // default
      }));
    });
    expect(mockGoBack).toHaveBeenCalled();
  });
});
