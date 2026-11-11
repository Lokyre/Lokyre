import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    await waitFor(async () => {
      const header = await screen.findByText('Gestor de Deudas');
      expect(header).toBeTruthy();
    });
  });
});
