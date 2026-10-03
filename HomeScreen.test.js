import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from './HomeScreen';
import { DebtContext } from './DebtContext';
import { NavigationContainer } from '@react-navigation/native';

const mockNavigation = {
  navigate: jest.fn(),
};

const renderWithContext = (component, debts = []) => {
  return render(
    <DebtContext.Provider value={{ debts }}>
      <NavigationContainer>
        {component}
      </NavigationContainer>
    </DebtContext.Provider>
  );
};

describe('HomeScreen', () => {
  it('renders empty list correctly', () => {
    const { getByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('No hay deudas registradas.')).toBeTruthy();
    expect(getByText('$0.00')).toBeTruthy(); // Total amount
  });

  it('renders debts and calculates total correctly', () => {
    const debts = [
      { id: '1', name: 'Debt 1', amount: 100, type: 'Tarjetas' },
      { id: '2', name: 'Debt 2', amount: 200, type: 'Créditos' },
    ];
    const { getByText } = renderWithContext(<HomeScreen navigation={mockNavigation} />, debts);

    expect(getByText('Debt 1')).toBeTruthy();
    expect(getByText('Debt 2')).toBeTruthy();
    expect(getByText('$300.00')).toBeTruthy();
  });

  it('navigates to AddEditDebtScreen on FAB press', () => {
    const { getByTestId } = renderWithContext(<HomeScreen navigation={mockNavigation} />);
    fireEvent.press(getByTestId('add-debt-fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });
});
