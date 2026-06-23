import React from 'react';
import { render, act } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders root component successfully', async () => {
    const { getByText } = render(<App />);

    await act(async () => {
      await Promise.resolve(); // Wait for context init
    });

    // Check if the initial screen (HomeScreen) renders
    expect(getByText('Mis Deudas')).toBeTruthy();
  });
});
