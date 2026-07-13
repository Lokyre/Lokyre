import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('App Integration', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([
      { id: '1', title: 'Car Loan', amount: 5000, type: 'Crédito', dueDate: '2023-12-01', isPaid: false }
    ]));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders HomeScreen and displays debt correctly', async () => {
    const { getByText, queryByText, debug } = render(<App />);

    await act(async () => {
      await Promise.resolve(); // Wait for AsyncStorage
    });

    // Navigation titles might not render as plain text or might be hidden
    // Let's rely on finding our specific data instead
    expect(getByText('Car Loan')).toBeTruthy();
    expect(getByText('$5000.00 (Pendiente)')).toBeTruthy();
  });
});
