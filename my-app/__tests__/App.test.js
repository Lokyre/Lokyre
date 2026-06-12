import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders correctly and has basic navigation', async () => {
    const { getByText, getByTestId, queryByText } = render(<App />);

    // Wait for App to load debts (mock async storage loading)
    await waitFor(() => {
      expect(getByText('Mis Deudas')).toBeTruthy();
    });

    // Check if the FAB is there
    const fab = getByTestId('fab');
    expect(fab).toBeTruthy();

    // Tap on the FAB to go to AddDebt screen
    fireEvent.press(fab);

    await waitFor(() => {
      expect(getByText('Nueva Deuda')).toBeTruthy();
    });
  });
});
