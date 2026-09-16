import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import AddEditDebtScreen from '../src/screens/AddEditDebtScreen';
import { DebtContext } from '../src/context/DebtContext';
import { useNavigation, useRoute } from '@react-navigation/native';

describe('HomeScreen', () => {
  const mockNavigate = jest.fn();
  const mockDeleteDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({ navigate: mockNavigate });
  });

  const renderHomeScreen = (debts = []) => {
    return render(
      <DebtContext.Provider value={{ debts, deleteDebt: mockDeleteDebt }}>
        <HomeScreen />
      </DebtContext.Provider>
    );
  };

  it('renders total pending amount and debts correctly', () => {
    const debts = [
      { id: '1', title: 'Tarjeta Visa', amount: 500, category: 'Tarjetas' },
      { id: '2', title: 'Prestamo', amount: 1500, category: 'Créditos' },
    ];
    const { getByText } = renderHomeScreen(debts);

    expect(getByText('Total Pendiente')).toBeTruthy();
    expect(getByText('$2000.00')).toBeTruthy();
    expect(getByText('Tarjeta Visa')).toBeTruthy();
    expect(getByText('Tarjetas')).toBeTruthy();
    expect(getByText('Monto: $500.00')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen on FAB press', () => {
    const { getByTestId } = renderHomeScreen();
    fireEvent.press(getByTestId('add-fab'));
    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt');
  });

  it('navigates to AddEditDebtScreen with debtId on edit press', () => {
    const debts = [{ id: '1', title: 'Visa', amount: 100, category: 'Tarjetas' }];
    const { getByTestId } = renderHomeScreen(debts);

    fireEvent.press(getByTestId('edit-btn-1'));
    expect(mockNavigate).toHaveBeenCalledWith('AddEditDebt', { debtId: '1' });
  });

  it('calls deleteDebt on delete press', () => {
    const debts = [{ id: '1', title: 'Visa', amount: 100, category: 'Tarjetas' }];
    const { getByTestId } = renderHomeScreen(debts);

    fireEvent.press(getByTestId('delete-btn-1'));
    expect(mockDeleteDebt).toHaveBeenCalledWith('1');
  });
});

describe('AddEditDebtScreen', () => {
  const mockGoBack = jest.fn();
  const mockAddDebt = jest.fn();
  const mockEditDebt = jest.fn();
  const mockAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigation.mockReturnValue({ goBack: mockGoBack });
    global.alert = mockAlert;
  });

  afterEach(() => {
    delete global.alert;
  });

  const renderScreen = (debts = [], routeParams = {}) => {
    useRoute.mockReturnValue({ params: routeParams });
    return render(
      <DebtContext.Provider value={{ debts, addDebt: mockAddDebt, editDebt: mockEditDebt }}>
        <AddEditDebtScreen />
      </DebtContext.Provider>
    );
  };

  it('adds a new debt', () => {
    const { getByTestId, getByText } = renderScreen();

    fireEvent.changeText(getByTestId('title-input'), 'Amigo');
    fireEvent.changeText(getByTestId('amount-input'), '200');
    fireEvent.press(getByTestId('radio-personas'));
    fireEvent.press(getByTestId('save-button'));

    expect(mockAddDebt).toHaveBeenCalledWith('Amigo', '200', 'Personas');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('edits an existing debt', () => {
    const debts = [{ id: '1', title: 'Old Title', amount: 50, category: 'Otros' }];
    const { getByTestId } = renderScreen(debts, { debtId: '1' });

    expect(getByTestId('title-input').props.value).toBe('Old Title');

    fireEvent.changeText(getByTestId('amount-input'), '75');
    fireEvent.press(getByTestId('save-button'));

    expect(mockEditDebt).toHaveBeenCalledWith('1', 'Old Title', '75', 'Otros');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('shows alert if required fields are missing', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('save-button'));

    expect(mockAlert).toHaveBeenCalledWith('Por favor completa todos los campos.');
    expect(mockAddDebt).not.toHaveBeenCalled();
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});
