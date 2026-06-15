import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

const mockNavigation = {
  navigate: jest.fn(),
};

const renderWithContext = (component, providerValues) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={providerValues}>
        {component}
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with empty debts', () => {
    const { getByText } = renderWithContext(
      <HomeScreen navigation={mockNavigation} />,
      { debts: [], loading: false, toggleDebtStatus: jest.fn() }
    );

    expect(getByText('Total Pendiente')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
  });

  it('renders debts and calculates total correctly', () => {
    const mockDebts = [
      { id: '1', title: 'Debt 1', amount: 100, isPaid: false, type: 'Tarjeta' },
      { id: '2', title: 'Debt 2', amount: 50, isPaid: true, type: 'Crédito' },
      { id: '3', title: 'Debt 3', amount: 200, isPaid: false, type: 'Persona' },
    ];

    const { getByText, queryByText } = renderWithContext(
      <HomeScreen navigation={mockNavigation} />,
      { debts: mockDebts, loading: false, toggleDebtStatus: jest.fn() }
    );

    expect(getByText('$300.00')).toBeTruthy(); // 100 + 200 (only unpaid)
    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
    expect(getByText('Debt 3')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen on FAB press', () => {
    const { getByTestId } = renderWithContext(
      <HomeScreen navigation={mockNavigation} />,
      { debts: [], loading: false, toggleDebtStatus: jest.fn() }
    );

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });

  it('navigates to DebtDetailScreen on debt item press', () => {
    const mockDebts = [
      { id: '1', title: 'Debt 1', amount: 100, isPaid: false, type: 'Tarjeta' },
    ];

    const { getByText } = renderWithContext(
      <HomeScreen navigation={mockNavigation} />,
      { debts: mockDebts, loading: false, toggleDebtStatus: jest.fn() }
    );

    fireEvent.press(getByText('Debt 1'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtDetail', { id: '1' });
  });
});
