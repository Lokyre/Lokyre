import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

jest.useFakeTimers();

describe('App', () => {
  it('renders without crashing', async () => {
    const { getByText } = render(<App />);

    await waitFor(() => {
      // It looks like native stack headers might not be queryable directly by text in this setup,
      // but we can look for something that is definitely rendered in the home screen content.
      expect(getByText('No tienes deudas registradas.')).toBeTruthy();
    });
  });
});
