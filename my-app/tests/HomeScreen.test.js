import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtContext } from '../src/context/DebtContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});

describe('HomeScreen', () => {
  const mockNavigation = { navigate: jest.fn() };

  it('shows loading indicator when loading', () => {
    const { getByTestId } = render(
      <DebtContext.Provider value={{ debts: [], loading: true }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('calculates total debt correctly', () => {
    const debts = [
      { id: '1', amount: 100, category: 'tarjetas' },
      { id: '2', amount: 200, category: 'creditos' },
    ];
    const { getByText } = render(
      <DebtContext.Provider value={{ debts, loading: false }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    expect(getByText('$300.00')).toBeTruthy();
  });

  it('navigates to category list', () => {
    const { getByText } = render(
      <DebtContext.Provider value={{ debts: [], loading: false }}>
        <HomeScreen navigation={mockNavigation} />
      </DebtContext.Provider>
    );

    fireEvent.press(getByText('Tarjetas de Crédito'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('DebtList', { category: 'tarjetas', title: 'Tarjetas de Crédito' });
  });
});
