import 'react-native-gesture-handler/jestSetup';
import { View, Text } from 'react-native';
import '@testing-library/react-native';

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
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaConsumer: jest.fn(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset)
    }
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return () => <View />;
});
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: ''
}));

jest.mock('react-native-paper', () => {
  const originalModule = jest.requireActual('react-native-paper');
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    ...originalModule,
    Card: Object.assign(({ children, testID }) => <View testID={testID}>{children}</View>, {
      Title: ({ title, subtitle, left }) => (
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
          {left && left({})}
        </View>
      ),
      Content: ({ children }) => <View>{children}</View>,
      Actions: ({ children }) => <View>{children}</View>,
    }),
    RadioButton: Object.assign(({ value }) => <View />, {
      Group: ({ children }) => <View>{children}</View>,
      Item: ({ value }) => <View />
    })
  };
});
