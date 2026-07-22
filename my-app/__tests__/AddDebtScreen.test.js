import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import AddDebtScreen from '../src/screens/AddDebtScreen';
import { DebtProvider } from '../src/context/DebtContext';
import { Alert } from 'react-native';

const mockNavigation = {
  goBack: jest.fn(),
};

jest.spyOn(Alert, 'alert');

describe('AddDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows error alert if title or amount are missing', async () => {
    const { getByTestId } = render(
      <DebtProvider>
        <AddDebtScreen navigation={mockNavigation} />
      </DebtProvider>
    );

    fireEvent.press(getByTestId('btn-save'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor, ingresa el título y el monto.'
    );
  });

  it('saves the debt and goes back', async () => {
    const { getByTestId, getByText } = render(
      <DebtProvider>
        <AddDebtScreen navigation={mockNavigation} />
      </DebtProvider>
    );

    fireEvent.changeText(getByTestId('input-title'), 'New Debt');
    fireEvent.changeText(getByTestId('input-amount'), '150');
    fireEvent.changeText(getByTestId('input-duedate'), '2023-12-31');
    fireEvent.changeText(getByTestId('input-description'), 'Test description');

    // Changing type
    fireEvent.press(getByTestId('radio-credito'));

    fireEvent.press(getByTestId('btn-save'));

    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
