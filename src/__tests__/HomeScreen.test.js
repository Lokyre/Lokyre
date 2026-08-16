import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const mockDebts = [
  { id: '1', name: 'Debt 1', amount: 100, type: 'Tarjeta', isPaid: false },
  { id: '2', name: 'Debt 2', amount: 50, type: 'Persona', isPaid: true },
];

describe('HomeScreen', () => {
  const mockDeleteDebt = jest.fn();
  const mockToggleDebtStatus = jest.fn();

  const renderScreen = (debts) => render(
    <DebtContext.Provider value={{ debts, deleteDebt: mockDeleteDebt, toggleDebtStatus: mockToggleDebtStatus }}>
      <HomeScreen />
    </DebtContext.Provider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders debts and summary correctly', () => {
    const { getByText, getByTestId } = renderScreen(mockDebts);

    expect(getByText('Total deudas: 2')).toBeTruthy();
    expect(getByText('Pendientes: 1 | Pagadas: 1')).toBeTruthy();
    expect(getByText('Total Pendiente: $100.00')).toBeTruthy();
    expect(getByTestId('debt-card-1')).toBeTruthy();
    expect(getByTestId('debt-card-2')).toBeTruthy();
  });

  it('navigates to AddEditDebt when FAB is pressed', () => {
    const { getByTestId } = renderScreen([]);
    fireEvent.press(getByTestId('add-debt-fab'));
    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt');
  });

  it('navigates to AddEditDebt with debtId when edit icon is pressed', () => {
    const { getByTestId } = renderScreen(mockDebts);
    fireEvent.press(getByTestId('edit-debt-1'));
    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt', { debtId: '1' });
  });

  it('toggles debt status when icon is pressed', () => {
    const { getByTestId } = renderScreen(mockDebts);
    fireEvent.press(getByTestId('toggle-status-1'));
    expect(mockToggleDebtStatus).toHaveBeenCalledWith('1');
  });

  it('calls deleteDebt after Alert confirmation', () => {
    const spyAlert = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Simulate pressing "Eliminar"
      buttons[1].onPress();
    });

    const { getByTestId } = renderScreen(mockDebts);
    fireEvent.press(getByTestId('delete-debt-1'));

    expect(spyAlert).toHaveBeenCalled();
    expect(mockDeleteDebt).toHaveBeenCalledWith('1');
    spyAlert.mockRestore();
  });
});
