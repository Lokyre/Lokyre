import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import App from '../App';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    useSafeAreaInsets: jest.fn(() => inset),
    SafeAreaInsetsContext: { Consumer: ({ children }) => children(inset) },
  };
});

describe('App', () => {
  it('renders correctly', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Deuda Total Pendiente')).toBeTruthy();
      expect(screen.getByText('No tienes deudas registradas.')).toBeTruthy();
    });
  });
});
