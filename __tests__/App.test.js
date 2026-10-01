import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }),
    },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    MaterialCommunityIcons: (props) => <Text {...props}>{props.name}</Text>
  };
});

describe('App', () => {
  it('renders without crashing', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([]));
    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('Deuda Total')).toBeTruthy();
    });
  });
});
