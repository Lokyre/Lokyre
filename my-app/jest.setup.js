import 'react-native-gesture-handler/jestSetup';
import { View } from 'react-native';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('uuid', () => {
  let count = 0;
  return {
    v4: jest.fn(() => `mock-uuid-${count++}`)
  };
});

// React Native Paper dependencies mocks
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    useSafeAreaInsets: jest.fn().mockReturnValue(inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset)
    }
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
    MaterialCommunityIcons: () => <View />,
  };
});

// Mock Nested Components explicitly to avoid Element Type Invalid errors
jest.mock('react-native-paper', () => {
  const React = require('react');
  const ReactNative = require('react-native');
  const { View, Text, TouchableOpacity } = ReactNative;

  return {
    ...jest.requireActual('react-native-paper'),
    Card: Object.assign(({ children }) => <View>{children}</View>, {
      Content: ({ children }) => <View>{children}</View>,
      Title: ({ title, subtitle }) => <View><Text>{title}</Text><Text>{subtitle}</Text></View>,
      Actions: ({ children }) => <View>{children}</View>,
    }),
    RadioButton: Object.assign(({ value }) => <View>{value}</View>, {
      Group: ({ children }) => <View>{children}</View>,
      Item: ({ label, value }) => <View><Text>{label}</Text><Text>{value}</Text></View>,
    }),
  };
});
