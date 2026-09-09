import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { View, Text } from 'react-native';
jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    createStackNavigator: () => ({
      Navigator: ({ children }) => <View>{React.Children.toArray(children).map((child, i) => React.cloneElement(child, { key: i }))}</View>,
      Screen: ({ component: Component }) => <Component navigation={{ navigate: jest.fn(), goBack: jest.fn() }} route={{ params: {} }} />,
    }),
  };
});
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaInsetsContext: { Consumer: ({ children }) => children({ top: 0, bottom: 0, left: 0, right: 0 }) },
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  };
});
import App from '../../App';
jest.mock('../../src/screens/HomeScreen', () => {
  const { View, Text } = require('react-native');
  return () => <View><Text>Total Pendiente</Text></View>;
});
jest.mock('../../src/screens/AddEditDebtScreen', () => {
  const { View } = require('react-native');
  return () => <View></View>;
});
jest.mock('../../src/screens/DebtDetailScreen', () => {
  const { View } = require('react-native');
  return () => <View></View>;
});

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({ navigate: jest.fn(), goBack: jest.fn() })),
    useRoute: jest.fn(() => ({ params: {} })),
  };
});

describe('App', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      expect(getByText('Total Pendiente')).toBeTruthy();
    });
  });
});
