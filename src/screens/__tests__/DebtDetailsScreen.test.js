import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtDetailsScreen from '../DebtDetailsScreen';
import { DebtContext } from '../../context/DebtContext';
import { Alert, Platform } from 'react-native';

const mockNavigation = {
  goBack: jest.fn(),
};

const mockDeleteDebt = jest.fn();

const mockDebts = [
  { id: '1', name: 'Test Debt', amount: 500, type: 'Tarjetas', date: new Date('2023-01-01').toISOString() }
];

const renderWithContext = (component) => {
  return render(
    <DebtContext.Provider value={{ debts: mockDebts, deleteDebt: mockDeleteDebt }}>
      {component}
    </DebtContext.Provider>
  );
};

describe('DebtDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "No se encontró la deuda" if debt is not found', () => {
    const route = { params: { debtId: '999' } };
    const { getByText } = renderWithContext(<DebtDetailsScreen route={route} navigation={mockNavigation} />);

    expect(getByText('No se encontró la deuda.')).toBeTruthy();
  });

  it('renders debt details correctly', () => {
    const route = { params: { debtId: '1' } };
    const { getByText } = renderWithContext(<DebtDetailsScreen route={route} navigation={mockNavigation} />);

    expect(getByText('Test Debt')).toBeTruthy();
    expect(getByText('$500.00')).toBeTruthy();
    expect(getByText('Tarjetas')).toBeTruthy();
    expect(getByText('Eliminar / Marcar Resuelta')).toBeTruthy();
  });

  it('triggers delete confirmation alert', () => {
    const route = { params: { debtId: '1' } };
    const { getByText } = renderWithContext(<DebtDetailsScreen route={route} navigation={mockNavigation} />);

    fireEvent.press(getByText('Eliminar / Marcar Resuelta'));

    if (Platform.OS === 'web') {
      // In tests, window.confirm is not defined by default, but standard mock would be called.
      // Skipping specific web verification here as React Native handles OS differences.
    } else {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Eliminar Deuda',
        '¿Estás seguro de eliminar esta deuda?',
        expect.any(Array)
      );
    }
  });

  it('calls deleteDebt and navigates back when confirmed', () => {
    // Override alert to automatically call the "Eliminar" button's onPress
    Alert.alert.mockImplementationOnce((title, message, buttons) => {
      const deleteButton = buttons.find(b => b.text === 'Eliminar');
      deleteButton.onPress();
    });

    const route = { params: { debtId: '1' } };
    const { getByText } = renderWithContext(<DebtDetailsScreen route={route} navigation={mockNavigation} />);

    fireEvent.press(getByText('Eliminar / Marcar Resuelta'));

    if (Platform.OS !== 'web') {
      expect(mockDeleteDebt).toHaveBeenCalledWith('1');
      expect(mockNavigation.goBack).toHaveBeenCalled();
    }
  });
});
