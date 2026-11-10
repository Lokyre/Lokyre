import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  it('renders correctly', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Mis Deudas')).toBeTruthy();
    });
  });
});
