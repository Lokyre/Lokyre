import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { DebtProvider } from '../../context/DebtContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockNavigation = {
  navigate: jest.fn(),
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and shows total pending', async () => {
    const mockDebts = [
      { id: '1', title: 'Test 1', amount: 100, isPaid: false, type: 'Tarjeta', dueDate: '12/12/2024', description: '' },
      { id: '2', title: 'Test 2', amount: 50, isPaid: true, type: 'Crédito', dueDate: '13/12/2024', description: '' }
    ];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockDebts));

    const { getByText, getByTestId, queryByText } = render(
      <DebtProvider>
        <HomeScreen navigation={mockNavigation} />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    // Pending should be only from Test 1 (100)
    expect(getByText('$100.00')).toBeTruthy();

    // Check elements render
    expect(getByText('Test 1')).toBeTruthy();
    expect(getByText('Test 2')).toBeTruthy();
  });

  it('navigates to AddEditDebt on FAB press', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <DebtProvider>
        <HomeScreen navigation={mockNavigation} />
      </DebtProvider>
    );

    await act(async () => { await Promise.resolve(); });

    fireEvent.press(getByTestId('fab'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('AddEditDebt');
  });
});
