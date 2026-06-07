import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

const mockNavigation = { navigate: jest.fn() };

const renderScreen = (contextValue) => {
  return render(
    <PaperProvider>
      <DebtContext.Provider value={contextValue}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    </PaperProvider>
  );
};

describe('HomeScreen', () => {
  it('renders correctly with no debts', async () => {
    const { getByText, getByTestId } = renderScreen({ debts: [], loading: false, deleteDebt: jest.fn(), toggleDebtStatus: jest.fn() });

    await act(async () => { await Promise.resolve(); });

    expect(getByText('No tienes deudas registradas.')).toBeTruthy();
    expect(getByTestId('fab')).toBeTruthy();
  });

  it('renders debts and navigates to AddDebt on FAB press', async () => {
    const mockDebts = [{ id: '1', title: 'Test Debt', amount: 100, type: 'Tarjeta', dueDate: '2023-12-31', isPaid: false }];
    const { getByText, getByTestId } = renderScreen({ debts: mockDebts, loading: false, deleteDebt: jest.fn(), toggleDebtStatus: jest.fn() });

    await act(async () => { await Promise.resolve(); });

    expect(getByText('Test Debt')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId('fab'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });
});
