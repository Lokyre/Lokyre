import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { DebtProvider, DebtContext } from '../src/context/DebtContext';
import HomeScreen from '../src/screens/HomeScreen';
import AddDebtScreen from '../src/screens/AddDebtScreen';

// Mock child components for rendering without context issues
jest.mock('../src/screens/HomeScreen', () => {
  const { Text } = require('react-native');
  return () => <Text>HomeScreen Mock</Text>;
});

describe('Debt App', () => {
  it('renders initial AddDebtScreen successfully', () => {
    const mockContext = {
      debts: [],
      addDebt: jest.fn(),
    };

    const { getByTestId } = render(
      <DebtContext.Provider value={mockContext}>
        <AddDebtScreen navigation={{ goBack: jest.fn() }} />
      </DebtContext.Provider>
    );

    expect(getByTestId('input-title')).toBeTruthy();
    expect(getByTestId('input-amount')).toBeTruthy();
  });
});
