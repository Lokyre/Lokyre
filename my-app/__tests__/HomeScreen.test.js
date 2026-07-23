import React from 'react';
import { render, act } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { DebtProvider } from '../src/context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockDebts = [
  { id: '1', title: 'Debt 1', amount: 100, type: 'Individual', dueDate: '2025-01-01', description: '', isPaid: false },
  { id: '2', title: 'Debt 2', amount: 200, type: 'Tarjeta', dueDate: '2025-02-01', description: '', isPaid: true }
];

describe('HomeScreen', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
  });

  it('renders a list of debts', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByTestId, queryByText } = render(
      <DebtProvider>
        <HomeScreen navigation={{ navigate: jest.fn() }} />
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(queryByText('Debt 1')).toBeTruthy();
    expect(queryByText('Debt 2')).toBeTruthy();
  });
});
