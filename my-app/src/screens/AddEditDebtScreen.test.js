import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AddEditDebtScreen from './AddEditDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

describe('AddEditDebtScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
  };

  const mockAddDebt = jest.fn();
  const mockUpdateDebt = jest.fn();

  const renderWithContext = (component, debts = []) => {
    return render(
      <PaperProvider>
        <DebtContext.Provider value={{
          debts,
          addDebt: mockAddDebt,
          updateDebt: mockUpdateDebt,
        }}>
          {component}
        </DebtContext.Provider>
      </PaperProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for a new debt', () => {
    const { getByText, getByDisplayValue } = renderWithContext(
      <AddEditDebtScreen route={{ params: {} }} navigation={mockNavigation} />
    );

    expect(getByText('Guardar')).toBeTruthy();
  });

  it('renders correctly for editing an existing debt', () => {
    const existingDebts = [
      { id: '1', description: 'Test Debt', amount: 123, type: 'tarjeta' }
    ];

    const { getByDisplayValue } = renderWithContext(
      <AddEditDebtScreen route={{ params: { id: '1' } }} navigation={mockNavigation} />,
      existingDebts
    );

    expect(getByDisplayValue('Test Debt')).toBeTruthy();
    expect(getByDisplayValue('123')).toBeTruthy();
  });

  it('calls addDebt and goes back on save when creating', () => {
    const { getByText, UNSAFE_getAllByType } = renderWithContext(
      <AddEditDebtScreen route={{ params: {} }} navigation={mockNavigation} />
    );

    // In React Native Paper, TextInput label isn't directly exposed via getByLabelText in a way RTL likes,
    // so we can use getAllByType to grab the TextInputs (first is description, second is amount)
    const { TextInput } = require('react-native-paper');
    const inputs = UNSAFE_getAllByType(TextInput);

    fireEvent.changeText(inputs[0], 'New Debt');
    fireEvent.changeText(inputs[1], '456');

    fireEvent.press(getByText('Guardar'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      description: 'New Debt',
      amount: 456,
      type: 'individual' // default type
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
