import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DebtDetailScreen from '../DebtDetailScreen';
import { DebtContext } from '../../context/DebtContext';
import { Alert } from 'react-native';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({ goBack: mockGoBack }),
    useRoute: () => ({ params: { debtId: '1' } }),
  };
});

const mockDebts = [
  { id: '1', title: 'Debt 1', amount: 100, type: 'persona', isPaid: false, createdAt: '2023-01-01T00:00:00.000Z' }
];

describe('DebtDetailScreen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      // Trigger the 'yes'/'confirm' button automatically for tests
      buttons[1].onPress();
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders debt details', () => {
    const { getByText } = render(
      <DebtContext.Provider value={{ debts: mockDebts, markAsPaid: jest.fn(), deleteDebt: jest.fn() }}>
        <DebtDetailScreen />
      </DebtContext.Provider>
    );

    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Monto: $100.00')).toBeTruthy();
    expect(getByText('Estado: Pendiente')).toBeTruthy();
  });

  it('marks as paid', async () => {
    const mockMarkAsPaid = jest.fn().mockResolvedValue();
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: mockDebts, markAsPaid: mockMarkAsPaid, deleteDebt: jest.fn() }}>
        <DebtDetailScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('btn-pay'));
    await waitFor(() => {
      expect(mockMarkAsPaid).toHaveBeenCalledWith('1');
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  it('deletes debt', async () => {
    const mockDeleteDebt = jest.fn().mockResolvedValue();
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: mockDebts, markAsPaid: jest.fn(), deleteDebt: mockDeleteDebt }}>
        <DebtDetailScreen />
      </DebtContext.Provider>
    );

    fireEvent.press(getByTestId('btn-delete'));
    await waitFor(() => {
      expect(mockDeleteDebt).toHaveBeenCalledWith('1');
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});
