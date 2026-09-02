import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddDebtScreen from '../src/screens/AddDebtScreen';
import { DebtContext } from '../src/context/DebtContext';
import { PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';

const mockGoBack = jest.fn();

const renderComponent = (addDebt = jest.fn()) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={{ addDebt }}>
        <AddDebtScreen navigation={{ goBack: mockGoBack }} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('AddDebtScreen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    const { getByTestId, getAllByText } = renderComponent();

    expect(getByTestId('input-name')).toBeTruthy();
    expect(getByTestId('input-amount')).toBeTruthy();
    expect(getByTestId('input-due-date')).toBeTruthy();
    expect(getByTestId('input-desc')).toBeTruthy();
    expect(getAllByText('Tarjeta')).toBeTruthy();
    expect(getAllByText('Crédito')).toBeTruthy();
    expect(getAllByText('Persona')).toBeTruthy();
  });

  it('shows an alert if name is missing', () => {
    const { getByTestId } = renderComponent();

    fireEvent.press(getByTestId('save-button'));

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa un nombre para la deuda.');
  });

  it('shows an alert if amount is missing or invalid', () => {
    const { getByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('input-name'), 'TV');
    fireEvent.press(getByTestId('save-button'));

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Por favor ingresa un monto válido mayor a 0.');
  });

  it('successfully saves a new debt and navigates back', () => {
    const addDebtMock = jest.fn();
    const { getByTestId, getAllByText } = renderComponent(addDebtMock);

    fireEvent.changeText(getByTestId('input-name'), 'TV');
    fireEvent.changeText(getByTestId('input-amount'), '500');
    fireEvent.changeText(getByTestId('input-due-date'), '01/01/2024');
    fireEvent.changeText(getByTestId('input-desc'), 'New TV');

    fireEvent.press(getByTestId('save-button'));

    expect(addDebtMock).toHaveBeenCalledWith({
      name: 'TV',
      amount: 500,
      type: 'Tarjeta',
      dueDate: '01/01/2024',
      description: 'New TV',
    });

    expect(mockGoBack).toHaveBeenCalled();
  });
});
