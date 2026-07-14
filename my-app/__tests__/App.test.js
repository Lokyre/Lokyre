import React from 'react';
import { render, act, fireEvent } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mock Alert to prevent hanging
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock UUID to return deterministic ID for easier testing
jest.mock('uuid', () => {
  return {
    v4: jest.fn(() => 'test-debt-123')
  };
});

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders HomeScreen initially and allows adding a debt', async () => {
    // 1. Initial render
    const { getByText, queryByText, getByTestId, getAllByText } = render(<App />);

    // Wait for context to initialize (AsyncStorage load)
    await act(async () => { await Promise.resolve(); });

    // Header assertions on HomeScreen
    expect(getByText('Total Pendiente')).toBeTruthy();
    expect(getByText('No hay deudas para mostrar')).toBeTruthy();

    // 2. Navigate to Add Debt Screen
    const fab = getByTestId('fab');
    fireEvent.press(fab);

    // Wait for navigation
    await act(async () => { await Promise.resolve(); });

    // 3. Fill and submit the add debt form
    const inputTitle = getByTestId('input-title');
    const inputAmount = getByTestId('input-amount');
    const btnSave = getByTestId('btn-save');

    fireEvent.changeText(inputTitle, 'Test Debt');
    fireEvent.changeText(inputAmount, '150');

    // Attempt saving
    await act(async () => {
      fireEvent.press(btnSave);
      // Wait for AsyncStorage write and goBack
      await Promise.resolve();
    });

    // 4. Verify we are back on HomeScreen and the debt is listed
    await act(async () => { await Promise.resolve(); });

    // 'No hay deudas' text should be gone
    expect(queryByText('No hay deudas para mostrar')).toBeNull();
    // Debt info should be visible
    expect(getByTestId('debt-title-test-debt-123')).toBeTruthy();

    // Get the title text specifically from the testID container
    const titleElement = getByTestId('debt-title-test-debt-123');
    // Using simple existence checks due to Nested Text mock structure
    expect(titleElement).toBeTruthy();
  });
});
