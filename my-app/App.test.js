import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    let root;
    root = render(<App />);
    await act(async () => {
      // Allow async initializations (like AsyncStorage loading) to finish
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(root.getByText('Mis Deudas')).toBeTruthy();
    });
  });
});
