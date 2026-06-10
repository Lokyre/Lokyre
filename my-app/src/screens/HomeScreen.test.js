import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from '../context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

describe('HomeScreen', () => {
  const mockNavigation = { navigate: jest.fn() };

  it('renders loading indicator initially', () => {
    const { UNSAFE_getByType } = render(
      <PaperProvider>
        <DebtContext.Provider value={{ debts: [], loading: true }}>
          <HomeScreen navigation={mockNavigation} />
        </DebtContext.Provider>
      </PaperProvider>
    );

    const activityIndicator = UNSAFE_getByType(require('react-native-paper').ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
  });

  it('renders debts correctly', async () => {
    const debts = [
      { id: '1', title: 'Test Debt 1', amount: '100', type: 'Tarjeta', dueDate: '2023-12-31', isPaid: false },
    ];

    const { getByText, getByTestId } = render(
      <PaperProvider>
        <DebtContext.Provider value={{ debts, loading: false }}>
          <HomeScreen navigation={mockNavigation} />
        </DebtContext.Provider>
      </PaperProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByText('Total Pendiente')).toBeTruthy();
    expect(getByText('$100.00')).toBeTruthy();
    expect(getByTestId('debt-card-1')).toBeTruthy();
  });

  it('navigates to AddDebt screen on FAB press', async () => {
    const { getByTestId } = render(
      <PaperProvider>
        <DebtContext.Provider value={{ debts: [], loading: false }}>
          <HomeScreen navigation={mockNavigation} />
        </DebtContext.Provider>
      </PaperProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddDebt');
  });
});
