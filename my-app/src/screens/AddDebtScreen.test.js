import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AddDebtScreen from './AddDebtScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

const renderAddDebtScreen = (addDebtMock) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={{ addDebt: addDebtMock }}>
        <AddDebtScreen navigation={{ navigate: mockNavigate, goBack: mockGoBack }} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('AddDebtScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    const { getByTestId, getAllByText } = renderAddDebtScreen(jest.fn());
    expect(getByTestId('title-input')).toBeTruthy();
    expect(getByTestId('amount-input')).toBeTruthy();
    expect(getByTestId('dueDate-input')).toBeTruthy();
    expect(getByTestId('description-input')).toBeTruthy();
    expect(getAllByText('Tarjeta').length).toBeGreaterThan(0);
    expect(getAllByText('Crédito').length).toBeGreaterThan(0);
  });

  it('shows error if required fields are missing', () => {
    const { getByTestId, getByText } = renderAddDebtScreen(jest.fn());

    fireEvent.press(getByTestId('save-button'));

    expect(getByText('Por favor completa todos los campos requeridos (*)')).toBeTruthy();
  });

  it('shows error if amount is invalid', () => {
    const { getByTestId, getByText } = renderAddDebtScreen(jest.fn());

    fireEvent.changeText(getByTestId('title-input'), 'Test Debt');
    fireEvent.changeText(getByTestId('amount-input'), 'abc');
    fireEvent.changeText(getByTestId('dueDate-input'), '12/12/2023');
    fireEvent.press(getByTestId('save-button'));

    expect(getByText('El monto debe ser un número válido mayor a 0')).toBeTruthy();
  });

  it('calls addDebt and goes back on valid submission', () => {
    const mockAddDebt = jest.fn();
    const { getByTestId } = renderAddDebtScreen(mockAddDebt);

    fireEvent.changeText(getByTestId('title-input'), 'New Debt');
    fireEvent.changeText(getByTestId('amount-input'), '150');
    fireEvent.changeText(getByTestId('dueDate-input'), '01/01/2024');
    fireEvent.changeText(getByTestId('description-input'), 'Test desc');
    fireEvent.press(getByTestId('save-button'));

    expect(mockAddDebt).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Debt',
      amount: '150',
      dueDate: '01/01/2024',
      description: 'Test desc',
      type: 'Tarjeta',
      isPaid: false
    }));

    // uuid should have been generated
    expect(mockAddDebt.mock.calls[0][0]).toHaveProperty('id');
    expect(mockGoBack).toHaveBeenCalled();
  });
});
