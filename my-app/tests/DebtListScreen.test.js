import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtListScreen from '../src/screens/DebtListScreen';
import { DebtContext } from '../src/context/DebtContext';

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
  };
});

describe('DebtListScreen', () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockDeleteDebt = jest.fn();
  const mockRoute = { params: { category: 'tarjetas' } };

  it('renders empty state correctly', () => {
    const { getByText } = render(
      <DebtContext.Provider value={{ debts: [], deleteDebt: mockDeleteDebt }}>
        <DebtListScreen navigation={mockNavigation} route={mockRoute} />
      </DebtContext.Provider>
    );

    expect(getByText('No hay deudas en esta categoría.')).toBeTruthy();
  });

  it('renders list of debts', () => {
    const debts = [
      { id: '1', title: 'Test 1', amount: 50, category: 'tarjetas' },
    ];
    const { getByText } = render(
      <DebtContext.Provider value={{ debts, deleteDebt: mockDeleteDebt }}>
        <DebtListScreen navigation={mockNavigation} route={mockRoute} />
      </DebtContext.Provider>
    );

    expect(getByText('Test 1')).toBeTruthy();
    expect(getByText('$50.00')).toBeTruthy();
  });

  it('navigates to AddEdit on FAB press', () => {
    // Note: React Native Paper FAB might require looking up by testID or similar,
    // but we can try getting by the wrapper or the accessibility label if set.
    // For simplicity, we will query by type or role.
    const { getByRole } = render(
      <DebtContext.Provider value={{ debts: [], deleteDebt: mockDeleteDebt }}>
        <DebtListScreen navigation={mockNavigation} route={mockRoute} />
      </DebtContext.Provider>
    );

    const fab = getByRole('button');
    fireEvent.press(fab);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt', { category: 'tarjetas' });
  });
});
