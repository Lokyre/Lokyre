import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';
import { Alert } from 'react-native';

const mockNavigate = jest.fn();

const renderHomeScreen = (contextValue) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={contextValue}>
        <HomeScreen navigation={{ navigate: mockNavigate }} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator when loading', () => {
    const { UNSAFE_getByType } = renderHomeScreen({ debts: [], loading: true, deleteDebt: jest.fn(), toggleDebtPaid: jest.fn() });
    expect(UNSAFE_getByType(require('react-native-paper').ActivityIndicator)).toBeTruthy();
  });

  it('shows empty state when no debts', () => {
    const { getByText } = renderHomeScreen({ debts: [], loading: false, deleteDebt: jest.fn(), toggleDebtPaid: jest.fn() });
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
  });

  it('renders a list of debts', () => {
    const debts = [
      { id: '1', title: 'Card Debt', amount: '500', type: 'Tarjeta', dueDate: '12/12/2023', description: 'desc', isPaid: false }
    ];
    const { getByText, getAllByText } = renderHomeScreen({ debts, loading: false, deleteDebt: jest.fn(), toggleDebtPaid: jest.fn() });

    expect(getByText('Card Debt')).toBeTruthy();
    expect(getByText('Monto: $500')).toBeTruthy();
    expect(getByText('Pendiente')).toBeTruthy();
  });

  it('navigates to AddDebt screen when FAB is pressed', async () => {
    const { getByTestId } = renderHomeScreen({ debts: [], loading: false, deleteDebt: jest.fn(), toggleDebtPaid: jest.fn() });

    await act(async () => {
      fireEvent.press(getByTestId('fab'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });

  it('calls toggleDebtPaid when check icon is pressed', async () => {
    const mockToggle = jest.fn();
    const debts = [
      { id: '1', title: 'Card Debt', amount: '500', type: 'Tarjeta', dueDate: '12/12/2023', description: 'desc', isPaid: false }
    ];
    const { getByTestId } = renderHomeScreen({ debts, loading: false, deleteDebt: jest.fn(), toggleDebtPaid: mockToggle });

    await act(async () => {
      fireEvent.press(getByTestId('toggle-1'));
    });

    expect(mockToggle).toHaveBeenCalledWith('1');
  });

  it('shows alert when delete icon is pressed and calls deleteDebt on confirmation', async () => {
    const mockDelete = jest.fn();
    const debts = [
      { id: '1', title: 'Card Debt', amount: '500', type: 'Tarjeta', dueDate: '12/12/2023', description: 'desc', isPaid: false }
    ];

    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Simulate pressing the 'Eliminar' button
      buttons.find(btn => btn.text === 'Eliminar').onPress();
    });

    const { getByTestId } = renderHomeScreen({ debts, loading: false, deleteDebt: mockDelete, toggleDebtPaid: jest.fn() });

    await act(async () => {
      fireEvent.press(getByTestId('delete-1'));
    });

    expect(alertSpy).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith('1');
  });
});
