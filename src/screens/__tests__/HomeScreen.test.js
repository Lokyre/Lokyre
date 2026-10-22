import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { DebtContext } from '../../context/DebtContext';
import HomeScreen from '../HomeScreen';

const renderWithContext = (component, contextValue) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={contextValue}>
        {component}
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('HomeScreen', () => {
  it('renders correctly with no debts', () => {
    const mockContext = { debts: [], removeDebt: jest.fn(), toggleDebtPaid: jest.fn() };
    const { getByText } = renderWithContext(<HomeScreen navigation={{}} />, mockContext);

    expect(getByText('No tienes deudas registradas.')).toBeTruthy();
    expect(getByText('Deuda Total Pendiente')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });

  it('renders a list of debts and calculates total correctly', () => {
    const mockContext = {
      debts: [
        { id: '1', name: 'Laptop', amount: 1000, type: 'Créditos', isPaid: false },
        { id: '2', name: 'Lunch', amount: 50, type: 'Individuales', isPaid: true }
      ],
      removeDebt: jest.fn(),
      toggleDebtPaid: jest.fn()
    };

    const { getByText } = renderWithContext(<HomeScreen navigation={{}} />, mockContext);

    // Total should only include unpaid debts (1000)
    expect(getByText('$1000.00')).toBeTruthy();

    // Check if debt names appear
    expect(getByText('Laptop')).toBeTruthy();
    expect(getByText('Lunch')).toBeTruthy();
  });

  it('navigates to AddDebt screen when FAB is pressed', () => {
    const mockNavigate = jest.fn();
    const mockContext = { debts: [], removeDebt: jest.fn(), toggleDebtPaid: jest.fn() };
    const { getByTestId } = renderWithContext(<HomeScreen navigation={{ navigate: mockNavigate }} />, mockContext);

    fireEvent.press(getByTestId('fab-add-debt'));
    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });

  it('calls toggleDebtPaid when check icon is pressed', () => {
    const mockToggle = jest.fn();
    const mockContext = {
      debts: [{ id: '1', name: 'Laptop', amount: 1000, type: 'Créditos', isPaid: false }],
      removeDebt: jest.fn(),
      toggleDebtPaid: mockToggle
    };

    const { getByTestId } = renderWithContext(<HomeScreen navigation={{}} />, mockContext);
    fireEvent.press(getByTestId('toggle-btn-1'));

    expect(mockToggle).toHaveBeenCalledWith('1');
  });

  it('calls removeDebt when delete icon is pressed', () => {
    const mockRemove = jest.fn();
    const mockContext = {
      debts: [{ id: '1', name: 'Laptop', amount: 1000, type: 'Créditos', isPaid: false }],
      removeDebt: mockRemove,
      toggleDebtPaid: jest.fn()
    };

    const { getByTestId } = renderWithContext(<HomeScreen navigation={{}} />, mockContext);
    fireEvent.press(getByTestId('delete-btn-1'));

    expect(mockRemove).toHaveBeenCalledWith('1');
  });
});
