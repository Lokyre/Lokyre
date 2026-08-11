import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtProvider } from '../context/DebtContext';
import { AddEditDebtScreen } from '../screens/AddEditDebtScreen';

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn()
};

const mockRoute = {
  params: {}
};

describe('AddEditDebtScreen', () => {
  it('renders correctly and can add a debt', async () => {
    const { getByTestId, getByText } = render(
      <DebtProvider>
        <AddEditDebtScreen navigation={mockNavigation} route={mockRoute} />
      </DebtProvider>
    );

    const titleInput = getByTestId('debt-title-input');
    const amountInput = getByTestId('debt-amount-input');
    const dateInput = getByTestId('debt-date-input');
    const saveButton = getByTestId('save-debt-button');

    fireEvent.changeText(titleInput, 'Test Debt');
    fireEvent.changeText(amountInput, '100');
    fireEvent.changeText(dateInput, '12/12/2024');

    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
