import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import App from '../App';

// Mock get-random-values globally
jest.mock('react-native-get-random-values', () => ({
  getRandomBase64: jest.fn(),
}));

// Provide basic mocks required for Paper and Navigation
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, left: 0, right: 0, bottom: 0 }) },
  useSafeAreaInsets: jest.fn(() => ({ top: 0, left: 0, right: 0, bottom: 0 })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return () => <View />;
});

// Mock Gesture Handler for React Navigation
import 'react-native-gesture-handler/jestSetup';

describe('App', () => {
  it('renders correctly', async () => {
    const component = render(<App />);

    // Call this to prevent unmounted act warnings
    await act(async () => {
      await Promise.resolve();
    });

    // Wait for the async storage to be "read" in DebtContext
    await waitFor(() => {
      expect(component.getByText('Mis Deudas')).toBeTruthy();
    });
  });
});
