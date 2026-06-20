import 'react-native-gesture-handler/jestSetup';
import { jest } from '@jest/globals';
import '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset)
    }
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const RealPaper = jest.requireActual('react-native-paper');

  return {
    ...RealPaper,
    Card: {
      ...RealPaper.Card,
      Content: ({ children, style }) => <View style={style}>{children}</View>
    },
    RadioButton: Object.assign(
      (props) => <View {...props} />,
      {
        Group: ({ children, onValueChange, value }) => <View>{children}</View>,
        Item: (props) => <View {...props} />
      }
    )
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />
  };
});
