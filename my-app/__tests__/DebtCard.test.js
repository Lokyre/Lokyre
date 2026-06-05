import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtCard from '../src/components/DebtCard';
import { Provider as PaperProvider } from 'react-native-paper';

describe('DebtCard', () => {
  const mockDebt = {
    id: '1',
    title: 'Test Debt',
    amount: 100,
    type: 'Tarjeta',
    dueDate: '2023-12-31',
    description: 'Test Description',
    isPaid: false,
  };

  it('renders correctly', () => {
    const { getByText } = render(
      <PaperProvider>
        <DebtCard debt={mockDebt} onDelete={jest.fn()} onToggleStatus={jest.fn()} />
      </PaperProvider>
    );

    expect(getByText('Test Debt')).toBeTruthy();
    expect(getByText('Tarjeta - Vence: 2023-12-31')).toBeTruthy();
    expect(getByText('Monto: $100.00')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
    expect(getByText('Estado: Pendiente')).toBeTruthy();
  });
});
