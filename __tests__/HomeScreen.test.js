import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/context/DebtContext';
import { PaperProvider } from 'react-native-paper';

const mockNavigate = jest.fn();

const renderComponent = (debts, removeDebt = jest.fn(), getTotalDebtAmount = () => debts.reduce((a, b) => a + Number(b.amount), 0)) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={{ debts, removeDebt, getTotalDebtAmount }}>
        <HomeScreen navigation={{ navigate: mockNavigate }} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('HomeScreen', () => {
  it('displays empty message when there are no debts', () => {
    const { getByText } = renderComponent([]);

    expect(getByText('No tienes deudas pendientes. ¡Genial!')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy();
  });

  it('renders a list of debts and calculates total', () => {
    const debts = [
      { id: '1', name: 'Laptop', amount: '1500', type: 'Crédito', dueDate: '10/10/2023', description: 'MacBook' },
      { id: '2', name: 'Pizza', amount: '20', type: 'Persona', dueDate: 'N/A' },
    ];
    const { getByText } = renderComponent(debts);

    expect(getByText('$1520.00')).toBeTruthy();
    expect(getByText('Laptop')).toBeTruthy();
    expect(getByText('Crédito - Vence: 10/10/2023')).toBeTruthy();
    expect(getByText('$1500.00')).toBeTruthy();

    expect(getByText('Pizza')).toBeTruthy();
    expect(getByText('Persona - Vence: N/A')).toBeTruthy();
    expect(getByText('$20.00')).toBeTruthy();
  });

  it('navigates to AddDebt screen when FAB is pressed', () => {
    const { getByTestId } = renderComponent([]);

    fireEvent.press(getByTestId('add-debt-fab'));

    expect(mockNavigate).toHaveBeenCalledWith('AddDebt');
  });

  it('calls removeDebt when delete button is pressed', () => {
    const debts = [{ id: '1', name: 'Laptop', amount: '1500', type: 'Crédito' }];
    const removeDebtMock = jest.fn();
    const { getByTestId } = renderComponent(debts, removeDebtMock);

    fireEvent.press(getByTestId('delete-btn-1'));

    expect(removeDebtMock).toHaveBeenCalledWith('1');
  });
});
