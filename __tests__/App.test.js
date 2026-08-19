import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, right: 0, bottom: 0, left: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  };
});

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({ params: { debtId: 'test-id' } })
}));

jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <>{children}</>,
      Screen: ({ component: Component, name }) => {
        // Only render Home screen in this simplified test to avoid navigation errors
        if (name === 'Home') return <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />;
        return null;
      }
    })
  };
});

describe('App', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => expect(getByText('Total Pendiente')).toBeTruthy());
  });
});
