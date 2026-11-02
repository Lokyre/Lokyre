import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders correctly', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Total: $0.00')).toBeTruthy();
    }, { timeout: 15000 });
  });
});
