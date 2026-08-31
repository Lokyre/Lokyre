import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import DebtDetailScreen from './DebtDetailScreen';
import { DebtContext } from '../context/DebtContext';

describe('DebtDetailScreen', () => {
  const mockNavigation = { goBack: jest.fn(), navigate: jest.fn() };
  const mockDeleteDebt = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      // Simulate clicking 'Eliminar' (the second button in our alert setup)
      buttons[1].onPress();
    });
  });

  const mockDebt = {
    id: '1',
    title: 'Prestamo Universidad',
    amount: 15000,
    type: 'Créditos',
    dueDate: '20-12-2025',
    description: 'Ultima cuota',
  };

  const renderScreen = (debts = [mockDebt], routeParams = { debtId: '1' }) => {
    return render(
      <DebtContext.Provider value={{ debts, deleteDebt: mockDeleteDebt }}>
        <DebtDetailScreen navigation={mockNavigation} route={{ params: routeParams }} />
      </DebtContext.Provider>
    );
  };

  it('renders "not found" if debt does not exist', () => {
    const { getByText } = renderScreen([], { debtId: 'invalid' });
    expect(getByText('Deuda no encontrada.')).toBeTruthy();
  });

  it('displays debt details correctly', () => {
    const { getByText } = renderScreen();
    expect(getByText('Prestamo Universidad')).toBeTruthy();
    expect(getByText('$15000')).toBeTruthy();
    expect(getByText('Créditos')).toBeTruthy();
    expect(getByText('20-12-2025')).toBeTruthy();
    expect(getByText('Ultima cuota')).toBeTruthy();
  });

  it('navigates to AddDebt screen for editing when Edit is pressed', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('btn-edit'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt', { debtId: '1' });
  });

  it('shows confirmation and calls delete on Delete button press', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('btn-delete'));

    expect(Alert.alert).toHaveBeenCalled();
    expect(mockDeleteDebt).toHaveBeenCalledWith('1');
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});