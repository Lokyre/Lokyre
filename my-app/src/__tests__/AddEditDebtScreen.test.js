import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddEditDebtScreen from '../screens/AddEditDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider, TextInput } from 'react-native-paper';

describe('AddEditDebtScreen', () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockAddDebt = jest.fn();
  const mockEditDebt = jest.fn();

  const renderScreen = (debts = [], routeParams = {}) => {
    return render(
      <PaperProvider>
        <DebtContext.Provider value={{ debts, addDebt: mockAddDebt, editDebt: mockEditDebt }}>
          <AddEditDebtScreen navigation={mockNavigation} route={{ params: routeParams }} />
        </DebtContext.Provider>
      </PaperProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for adding a new debt', () => {
    const { getByText } = renderScreen();
    expect(getByText('Nueva Deuda')).toBeTruthy();
  });

  it('adds a new debt and goes back', () => {
    const { getByText, UNSAFE_getAllByType } = renderScreen();

    const inputs = UNSAFE_getAllByType(TextInput);
    // Assuming order: Title, Amount, Date, Description
    fireEvent.changeText(inputs[0], 'New Debt');
    fireEvent.changeText(inputs[1], '150');
    fireEvent.changeText(inputs[2], '10/10/2025');

    fireEvent.press(getByText('Guardar'));

    expect(mockAddDebt).toHaveBeenCalledWith({
      title: 'New Debt',
      amount: 150,
      type: 'Tarjeta', // default
      dueDate: '10/10/2025',
      description: '',
    });
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('pre-fills data and edits existing debt', () => {
    const debts = [
      { id: '1', title: 'Old Debt', amount: 50, type: 'Crédito', dueDate: '01/01/2025', description: 'Desc' }
    ];

    const { getByText, UNSAFE_getAllByType } = renderScreen(debts, { debtId: '1' });

    expect(getByText('Editar Deuda')).toBeTruthy();

    const inputs = UNSAFE_getAllByType(TextInput);
    expect(inputs[0].props.value).toBe('Old Debt');

    fireEvent.changeText(inputs[0], 'Updated Debt');
    fireEvent.press(getByText('Guardar'));

    expect(mockEditDebt).toHaveBeenCalledWith('1', expect.objectContaining({
      title: 'Updated Debt',
    }));
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('alerts if required fields are missing', () => {
    // Mock global alert
    global.alert = jest.fn();
    const { getByText } = renderScreen();

    fireEvent.press(getByText('Guardar'));

    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('obligatorios'));
    expect(mockAddDebt).not.toHaveBeenCalled();
  });
});
