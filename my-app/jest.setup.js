import 'react-native-gesture-handler/jestSetup';
import { View } from 'react-native';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
}));

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn().mockImplementation(({ children }) => children),
    SafeAreaConsumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    SafeAreaView: jest.fn().mockImplementation(({ children }) => children),
    useSafeAreaInsets: jest.fn().mockImplementation(() => inset),
    SafeAreaInsetsContext: {
      Consumer: ({ children }) => children(inset)
    }
  };
});

// Mock react-native-paper and @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialCommunityIcons: () => <View />,
    Ionicons: () => <View />
  };
});

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => {
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Paper = jest.requireActual('react-native-paper');
  return {
    ...Paper,
    Card: Object.assign(({ children }) => <View>{children}</View>, {
      Content: ({ children }) => <View>{children}</View>,
      Title: ({ title, subtitle }) => (
        <View>
          <Text>{title}</Text>
          <Text>{subtitle}</Text>
        </View>
      ),
      Actions: ({ children }) => <View>{children}</View>,
    }),
    RadioButton: Object.assign(({ value }) => <View>{value}</View>, {
      Group: ({ children }) => <View>{children}</View>,
      Item: ({ label, value }) => <View>{label}{value}</View>
    })
  };
});
