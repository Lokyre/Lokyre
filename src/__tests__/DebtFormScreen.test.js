import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DebtFormScreen from '../screens/DebtFormScreen';
import { DebtContext } from '../context/DebtContext';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';

const mockNavigation = { goBack: jest.fn() };
const mockRoute = { params: {} };
const theme = { ...DefaultTheme };

describe('DebtFormScreen', () => {
  const mockContext = {
    debts: [],
    addDebt: jest.fn(),
    updateDebt: jest.fn(),
  };

  const renderComponent = () =>
    render(
      <PaperProvider theme={theme}>
        <DebtContext.Provider value={mockContext}>
          <DebtFormScreen navigation={mockNavigation} route={mockRoute} />
        </DebtContext.Provider>
      </PaperProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows validation errors if fields are empty', async () => {
    const { getByTestId, findByText } = renderComponent();

    fireEvent.press(getByTestId('btn-save'));

    expect(await findByText('El nombre es requerido')).toBeTruthy();
    expect(await findByText('Ingrese un monto válido mayor a 0')).toBeTruthy();
    expect(mockContext.addDebt).not.toHaveBeenCalled();
  });

  it('adds a debt when valid data is provided', async () => {
    const { getByTestId } = renderComponent();

    fireEvent.changeText(getByTestId('input-name'), 'Juan Perez');
    fireEvent.changeText(getByTestId('input-amount'), '150.50');

    fireEvent.press(getByTestId('btn-save'));

    await waitFor(() => {
      expect(mockContext.addDebt).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Juan Perez',
        amount: 150.5,
        type: 'Personal',
      }));
      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
