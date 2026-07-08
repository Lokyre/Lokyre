import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DebtDetailScreen from './DebtDetailScreen';
import { useDebts } from '../context/DebtContext';

jest.mock('../context/DebtContext');

describe('DebtDetailScreen', () => {
  const mockNavigation = { goBack: jest.fn() };
  const mockUpdateDebt = jest.fn();
  const mockDeleteDebt = jest.fn();

  const mockRoute = { params: { id: '1' } };

  const mockDebt = {
    id: '1',
    title: 'Test Debt',
    amount: 100,
    type: 'Tarjeta',
    dueDate: '2023-12-31',
    description: 'Test Description',
    isPaid: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders not found message if debt does not exist', () => {
    useDebts.mockReturnValue({ debts: [] });
    const { getByText } = render(<DebtDetailScreen route={mockRoute} navigation={mockNavigation} />);
    expect(getByText('Deuda no encontrada.')).toBeTruthy();
  });

  it('renders debt details correctly', () => {
    useDebts.mockReturnValue({ debts: [mockDebt], updateDebt: mockUpdateDebt, deleteDebt: mockDeleteDebt });
    const { getByTestId } = render(<DebtDetailScreen route={mockRoute} navigation={mockNavigation} />);

    expect(getByTestId('detail-title').props.children).toBe('Test Debt');
  });

  it('toggles debt status', () => {
    useDebts.mockReturnValue({ debts: [mockDebt], updateDebt: mockUpdateDebt, deleteDebt: mockDeleteDebt });
    const { getByTestId } = render(<DebtDetailScreen route={mockRoute} navigation={mockNavigation} />);

    fireEvent.press(getByTestId('toggle-status-button'));
    expect(mockUpdateDebt).toHaveBeenCalledWith('1', { isPaid: true });
  });

  it('deletes debt and navigates back', () => {
    useDebts.mockReturnValue({ debts: [mockDebt], updateDebt: mockUpdateDebt, deleteDebt: mockDeleteDebt });
    const { getByTestId } = render(<DebtDetailScreen route={mockRoute} navigation={mockNavigation} />);

    fireEvent.press(getByTestId('delete-button'));
    expect(mockDeleteDebt).toHaveBeenCalledWith('1');
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
