import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import DebtCard from '../src/components/DebtCard';
import { DebtProvider } from '../src/context/DebtContext';
import { Provider as PaperProvider } from 'react-native-paper';

describe('DebtCard', () => {
  it('renders correctly', async () => {
    const mockDebt = {
      id: '1',
      title: 'Mock Debt',
      amount: 150.50,
      type: 'Tarjeta',
      dueDate: '2025-12-31',
      isPaid: false
    };

    const { getByText, queryByText } = render(
      <DebtProvider>
        <PaperProvider>
            <DebtCard debt={mockDebt} onPress={jest.fn()} />
        </PaperProvider>
      </DebtProvider>
    );

    await act(async () => {
      await Promise.resolve();
    });

    // Using our mock setup, the texts should be easily queried
    expect(queryByText('Mock Debt')).toBeTruthy();
    expect(queryByText('$150.50 - Tarjeta')).toBeTruthy();
    expect(queryByText('Vence: 2025-12-31')).toBeTruthy();
  });
});