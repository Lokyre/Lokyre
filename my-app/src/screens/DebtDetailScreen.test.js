import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DebtContext } from '../context/DebtContext';
import DebtDetailScreen from './DebtDetailScreen';
import { Provider as PaperProvider } from 'react-native-paper';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useRoute: () => ({
      params: { id: '1' }
    }),
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
  };
});

describe('DebtDetailScreen', () => {
  it('displays debt details and toggles status', () => {
    const mockToggleDebtPaid = jest.fn();
    const mockDebts = [
      { id: '1', title: 'Test Debt', amount: '100', type: 'Crédito', isPaid: false, dueDate: '2024-01-01', description: 'test desc' }
    ];

    const { getByText } = render(
      <DebtContext.Provider value={{ debts: mockDebts, toggleDebtPaid: mockToggleDebtPaid, deleteDebt: jest.fn() }}>
        <PaperProvider>
          <NavigationContainer>
            <DebtDetailScreen />
          </NavigationContainer>
        </PaperProvider>
      </DebtContext.Provider>
    );

    expect(getByText('Test Debt')).toBeTruthy();
    expect(getByText('test desc')).toBeTruthy();

    const toggleButton = getByText('Marcar como Pagada');
    fireEvent.press(toggleButton);

    expect(mockToggleDebtPaid).toHaveBeenCalledWith('1');
  });
});
