import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders the Home screen with empty debt status correctly', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Total Deudas')).toBeTruthy();
      expect(screen.getAllByText('$0.00').length).toBeGreaterThan(0);
    }, { timeout: 15000 });
  }, 20000);

  it('can navigate to add new debt screen', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Total Deudas')).toBeTruthy();
    }, { timeout: 15000 });

    const fab = screen.getByTestId('add-debt-fab');
    fireEvent.press(fab);

    await waitFor(() => {
      expect(screen.getByText('Nueva Deuda')).toBeTruthy();
      expect(screen.getByTestId('title-input')).toBeTruthy();
    }, { timeout: 15000 });
  }, 20000);
});
