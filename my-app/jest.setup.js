import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset),
    },
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => ({
  __esModule: true,
  default: () => {
    const { View } = require('react-native');
    return <View />;
  }
}));

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const RealModule = jest.requireActual('react-native-paper');
  return {
    ...RealModule,
    Card: Object.assign(
      ({ children }) => <View>{children}</View>,
      {
        Content: ({ children }) => <View>{children}</View>,
        Actions: ({ children }) => <View>{children}</View>,
        Title: ({ children }) => <Text>{children}</Text>,
      }
    ),
    RadioButton: Object.assign(
      ({ value }) => <View testID={`radio-${value}`} />,
      {
        Group: ({ children }) => <View>{children}</View>,
      }
    ),
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
  };
});
