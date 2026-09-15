import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('App', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([]));
  });

  it('renders correctly and allows navigating to Add Debt', async () => {
    const { getByText, getByTestId } = render(<App />);

    await waitFor(() => {
      expect(getByText('Resumen de Deudas')).toBeTruthy();
    });

    // We can verify FAB is there (mocked to just show "FAB")
    const fab = getByText('FAB');
    expect(fab).toBeTruthy();

    fireEvent.press(fab);

    // Check if we navigated to add debt screen
    await waitFor(() => {
      expect(getByText('Guardar Deuda')).toBeTruthy();
    });
  });
});
