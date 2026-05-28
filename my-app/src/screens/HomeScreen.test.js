import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

describe('HomeScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  const mockDebts = [
    { id: '1', description: 'Tarjeta de Crédito', amount: 500, type: 'tarjeta', paid: false },
    { id: '2', description: 'Préstamo', amount: 200, type: 'credito', paid: true },
  ];

  const mockTogglePaid = jest.fn();
  const mockDeleteDebt = jest.fn();

  const renderWithContext = (component) => {
    return render(
      <PaperProvider>
        <DebtContext.Provider value={{
          debts: mockDebts,
          togglePaid: mockTogglePaid,
          deleteDebt: mockDeleteDebt,
        }}>
          {component}
        </DebtContext.Provider>
      </PaperProvider>
    );
  };

  it('renders correctly and shows total debt (only unpaid)', () => {
    const { getByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />);

    // Total debt should be 500 (since 200 is paid)
    expect(getByText('$500.00')).toBeTruthy();
    expect(getByText('Tarjeta de Crédito')).toBeTruthy();
    expect(getByText('Préstamo')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen on FAB press', () => {
    const { getByTestId } = renderWithContext(<HomeScreen navigation={mockNavigation} />);

    // In React Native Paper, the FAB defaults to testID "fab"
    const fab = getByTestId('fab');
    fireEvent.press(fab);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });
});
